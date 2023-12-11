/*

	XML to string
	Read a XML file, and return it's content into a string

*/



export const xml2str = ( file: File ): Promise<string> => {
	return new Promise( (resolve, reject) => {
		const reader = new FileReader();
		
		reader.onload = () => {
			if ( typeof reader.result === 'string' )
				resolve( reader.result );
			else
				reject( new Error( "ERROR READING FILE (func xml2str)" ) );
		};

		reader.onerror = () => {
			reject( new Error( "ERROR READING FILE (func xml2str)" ) );
		}


		reader.readAsText( file )
	} );
};
