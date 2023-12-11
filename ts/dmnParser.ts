/*

	DMN Parser
	Transform a .dmn into an usable JS object, using dmn-moddle library.

*/

import DmnModdle from 'dmn-moddle';
import {xml2str} from './xml2str';
import {DMN_Definitions} from './DMN-JS';



export const parseDMN = async ( xmlString: string ): Promise<any> => {
	const moddle = new DmnModdle();
	return moddle.fromXML( xmlString );
};


export const handleDMNdata = async ( xml: File ) => {
	try
	{	
		const xmlString = await xml2str( xml ); // Convert .xml to a string
		const dmnData = await parseDMN( xmlString ); // Transform the xmlString into a JS object
	
		// ...
	}
	catch ( error )
	{
		console.error( "ERROR DURING DMN DATA HANDLING: ", error );
	}
}
