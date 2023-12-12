/*
	DMN Viewer
	Display a .dmn file
*/


import { DMN } from "./DMN";


declare var DmnJS: any;



// Need to use Promises due to the new DmnJS API
export async function displayDMN( dmn: DMN ): Promise<void>
{
	// Create DmnJS viewer into 'canvas' HTML element
	const viewer = new DmnJS( {
		container: document.getElementById( 'canvas' ),
		width: '100%',
		height: '75vh' // window size (not perfect, needs to fit diagram)
	} );

	try
	{
		// Import the xml to the viewer
		await viewer.importXML( dmn.xmlString );
	}
	catch ( error )
	{
		console.error( "ERROR while displaying the diagram: ", error );
	}
}
