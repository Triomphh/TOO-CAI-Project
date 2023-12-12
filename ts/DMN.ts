/*
	DMN Object Class

	Created via a .dmn file imput
*/


import DmnModdle from 'dmn-moddle'; 
import {DMN_data} from './DMN-JS';



export class DMN
{
	private _dmnData: DMN_data | null;
	private _xmlString: string | null;
	

	constructor()
	{
		this._dmnData = null;
		this._xmlString = null;
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
			
			this._dmnData = {
				file_content: xml,
				me: rootElement,
				file_name: "diagram"
			};
		}
		catch ( error )
		{
			console.error( "ERROR when trying to initialize DMN object: ", error );
		}
	}
	

}
