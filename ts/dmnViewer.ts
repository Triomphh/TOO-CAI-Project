/*
	DMN Viewer
	Display a .dmn file
*/


import { DMN } from "./DMN";


declare var DmnJS: any;



// Need to use Promises due to the new DmnJS API
export async function displayDMN( dmn: DMN ): Promise<void>
{
	// Create DmnJS viewer into 'diagram-container' HTML element
	const viewer = new DmnJS( {
		container: document.getElementById( 'diagram-container' ),
		width: '100%',
		height: '60vh' // window size (not perfect, needs to fit diagram)
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
