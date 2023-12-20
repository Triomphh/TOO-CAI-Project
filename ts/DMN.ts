/*
	DMN Object Class

	Created via a .dmn file imput
*/


import DmnModdle from 'dmn-moddle'; 
import {DMN_Decision, DMN_DecisionRule, DMN_DecisionTable, DMN_Definitions, DMN_InputClause, DMN_UnaryTests, DMN_data, DMN_file, is_DMN_Decision, is_DMN_Definitions} from './DMN-JS';
import { evaluate, unaryTest } from 'feelin';


export class DMN
{
	private _dmnFile: DMN_file | null; // XML
	private _dmnData: DMN_data | null; // JSON (or string)
	private _xmlString: string | null;
	

	constructor()
	{
		this._dmnFile = null;
		this._dmnData = null;
		this._xmlString = null;
	}
	

	get file(): DMN_file | null
	{
		return this._dmnFile;
	}
	get data(): DMN_data | null
	{
		return this._dmnData;
	}
	// Faire attention aux noms/scopes
	get xmlString(): string | null 
	{
		return this._xmlString;
	}


	async load( xml: File | string ): Promise<void> 
	{
		try
		{
			// If xml is a (xml) File, convert it to a string, else it's already a string 
			this._xmlString = ( xml instanceof File ) ? await xml.text() : xml;
			const moddle = new DmnModdle();
			
			// Object destructuring here ( { rootElement } ), to comply with the asynchronous function 
			// otherwise, 
			// 		temp = await moddle.fromXML( ... );
			// 		rootElement = temp.rootElement;
			const { rootElement } = await moddle.fromXML( this._xmlString );


			this._dmnFile = {
				file_content: this._xmlString,
				file_name: "diagram"
			};

			this._dmnData = {
				me: rootElement as DMN_Definitions,
				file_name: "diagram"
			};
		}
		catch ( error )
		{
			console.error( "ERROR when trying to initialize DMN object: ", error );
		}
	}
	

	
	
	async evaluate( jsonFile: File ): Promise<any>
	{
		try
		{
			// Is _dmnData well initialized ? If not :
			if ( !this._dmnData || !this._dmnData.me )
				throw new Error( "DMN data is not properly initialized" );

			// Transform jsonFile into a usable json object
			if ( jsonFile.type !== "application/json" ) 
            	throw new Error( "File is not a JSON file." );
        	const fileContent = await jsonFile.text();
        	const json = JSON.parse( fileContent );
		


			// Get DMN Decisions 
			// FORCE CAST again...(for .drgElement) 
			const decisions = (this._dmnData.me as DMN_Definitions).drgElement.filter(
				(element: any) => is_DMN_Decision( element )
			) as DMN_Decision[];
			
			console.log( this._dmnData );
			console.log( "1. DESICIONS: ", decisions );
			console.log( "JSON input: ", json );
			
			let results: { [key: string]: any } = {};
			let context = { ...json };

			const reversedDecisions = [ ...decisions ].reverse();

			for ( let decision of reversedDecisions )
			{
				// Destructuring with renaming
				const { input: inputs, rule: rules } = decision.decisionLogic;				

				const sortedRules = rules.sort((a, b) => {
    			    const countEmptyA = a.inputEntry.filter(entry => !entry.text).length;
    			    const countEmptyB = b.inputEntry.filter(entry => !entry.text).length;
    			    return countEmptyA - countEmptyB;
    			});

				console.log( "sortedRules: ", sortedRules );
				console.log( "Input: ", inputs );
				
				for ( let rule of sortedRules )
				{
					// Test every unary tests for each rules, and if one 'UT' is not valid, go to next rule...

					let ruleValid: boolean = true;
					
					// Counter variable cause we need to link the the inputClause to its 'UT' ( so we can can get the inputClause.inputEntry.text to match our json data and make the test )
					for ( let i=0 ; i<rule.inputEntry.length ; i++ )
					{
						const unaryTestExpression = rule.inputEntry[i].text;
						const inputExpression = inputs[i].inputExpression!.text;

						if ( !unaryTestExpression ) continue; // Skip if unary test is empty (treat it like it's true)

						console.log( rule.inputEntry[i], inputs[i].inputExpression!.text );

						// Unary tests :
						console.log( unaryTestExpression, ", { '?': ", context[inputExpression], "} " );

						let testResult: boolean; // Forced to do it like this... unaryTest for boolean values work differently, we need to treat them like this:
						if ( unaryTestExpression === "true" || unaryTestExpression === "false" )
							testResult = unaryTest( 'a = b', { a: json[inputExpression], b: unaryTestExpression } );
						else // Regular way
							testResult = unaryTest( unaryTestExpression, { '?': context[inputExpression] } );
						
						console.log( testResult );


						if ( !testResult )
						{
							ruleValid =  false;
							break; // If a condition is not met, we stop unary tests / the rule is invalid.
						}

					}

					// If ruleValid is true after unary tests, then add it to the context cause it's the one we want
					if ( ruleValid )
					{
						try
						{
							const outputResult = await evaluate( rule.outputEntry[0].text, context ); // Check with the context ( json base data + previous decisions calculated data )
							results[ decision.name ] = outputResult;
						}
						catch ( error )
						{
							console.error( "ERROR FEEL output evaluation: ", error );
						}
						break;
					}
					
					context = { ...json, ...results }; // We add the results to our context so the parent table gets the calculated data it needs.
					console.log( "context: ", context );
					console.log( "=============================================================" );
				}
			}

			console.log( "Résultats de l'évaluation: ", results );
			return results;

		}
		catch ( error )
		{
			console.error( "ERROR during FEEL evaluation: ", error );
		}
	}


}
