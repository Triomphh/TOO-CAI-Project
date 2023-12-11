/*
	DMN Viewer
	Display a .dmn file
*/

import { xml2str } from "./xml2str";

declare var DmnJS: any;


// Need to use Promises due to the new DmnJS API, and xml2str has promises... So we go async function
export async function displayDMN( xml: File ): Promise<void>
{
	// Create DmnJS viewer into 'canvas' HTML element
	const viewer = new DmnJS({ 
		container: document.getElementById( 'canvas' ), 
		width: '100%',
		height: "75vh" // window size (not perfect, needs to fit diagram height)
	});
	
	try
	{
		// Convert the xml into a string
		const xmlString: string = await xml2str( xml );

		// Import it into the viewer
		await viewer.importXML( xmlString );
		console.log( "Diagram rendered" );
	}
	catch ( error )
	{
		console.error( "ERROR: ", error );
	}
}
