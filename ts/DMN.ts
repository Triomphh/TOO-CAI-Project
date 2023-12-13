/*
	DMN Object Class

	Created via a .dmn file imput
*/


import DmnModdle from 'dmn-moddle'; 
import {DMN_Decision, DMN_DecisionTable, DMN_Definitions, DMN_UnaryTests, DMN_data, DMN_file, is_DMN_Decision, is_DMN_Definitions} from './DMN-JS';
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
	
	
	async evaluate( json: any ): Promise<any>
	{
		try
		{
			// Is _dmnData well initialized ? If not :
			if ( !this._dmnData || !this._dmnData.me )
				throw new Error( "DMN data is not properly initialized" );


			
			// Get DMN Decisions 
			// FORCE CAST again...(for .drgElement) 
			const decisions = (this._dmnData.me as DMN_Definitions).drgElement.filter(
				(element: any) => is_DMN_Decision( element )
			) as DMN_Decision[];


			// FEEL evaluation results variable
			let results: { [key: string]: any } = {};


			//
			for ( let decision of decisions )
			{
				const decisionTable = decision.decisionLogic as DMN_DecisionTable;
				let decisionResult: string | null = null;

				for ( let rule of decisionTable.rule )
				{
					let conditionMet = true;

					for ( let i=0 ; i<rule.inputEntry.length ; i++ )
					{
						const inputEntry: DMN_UnaryTests = rule.inputEntry[i];
						const inputExpression = decisionTable.input[i].inputExpression!.text;

						// If entry is empty, skip it
						if ( !inputEntry.text )
							continue;


						// Copy of json object ( destructuring to get every properties & values )
						let context = { ...json };
						//
						if ( decisionResult )
							context[ decisionTable.input[i].inputExpression!.text ] = decisionResult;


						let result;
						try
						{
							result = await evaluate( inputEntry.text, context );
						}
						catch ( error )
						{
							result = unaryTest( inputEntry.text, context );
						}
						

						if ( !result )
						{
							conditionMet = false;
							break;
						}
					}
					
					// If every evaluation succeeded, evaluate the output
					if (conditionMet)
					{
						// À MODIFIER SI PLUSIEURS SORTIES (TEST)
						const result = await evaluate( rule.outputEntry[0].text, json );
						results[ decision.name ] = result;
						break; // Exit if it is satisfied
					}
				}
			}

			console.log( results );
			return results
		}
		catch ( error )
		{
			console.error( "ERROR during FEEL evaluation: ", error );
		}
	}


}
