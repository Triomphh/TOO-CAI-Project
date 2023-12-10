declare var DmnJS: any;


// Need to use Promises due to the new DmnJS API...
export function displayDMN( xml: File ): void
{
	// Create DmnJS viewer into 'canvas' HTML element
	const viewer = new DmnJS({ 
		container: document.getElementById( 'canvas' ), 
		width: '100%',
		height: "75vh" // window size (not perfect, needs to fit diagram height)
	});

	// Convert xml file into a string (mandatory for viewer.importXML)
	const reader = new FileReader();


	reader.onload = async () => {
		try 
		{
			const result = await viewer.importXML( reader.result as string );
			console.log( "RENDERED: ", result );
		}
		catch ( err )
		{
			console.error( "ERROR RENDERING: ", err );
		};

		reader.onerror = () => {
			console.error( "FileReader ERROR: ", reader.error );
		};	
	}

	reader.readAsText( xml );
}
