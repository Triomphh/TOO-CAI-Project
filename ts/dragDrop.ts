/*
    APIs: 
        HTML Drag and Drop API
        MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

        File API (for later)
        MDN : https://developer.mozilla.org/en-US/docs/Web/API/File
*/



/*
    Drag & Drop Handler

    TO DO:
        - Maybe document.addEventListener is bad codding ?? (to check)
        - Loading the DOM and window correctly : http://109.26.178.21/fbarbier/Programming/TypeScript/TypeScript_DOM.html
        - Check 'else throw new Error...' if it's correct Error Handling
        - ...
*/
const dragAndDrop = (): void => {

     // ...a dragged item enters a valid drop target
    document.addEventListener( 'dragenter', ( event: DragEvent ) => {
        window.console.log( "dragenter" );
        // Prevent default behavior (prevent file from being opened)
        event.preventDefault();
    }, false );


    // ...a dragged item is being dragged over a valid drop target, every few hundred milliseconds
    document.addEventListener( 'dragover', ( event: DragEvent ) => {
        window.console.log( "dragover" );
        event.preventDefault();
    }, false );


    // ...an item is dropped on a valid drop target
    document.addEventListener( 'drop', ( event: DragEvent ) => {
        event.preventDefault();

        if( 'dataTransfer' in event )
        {
            // Use DataTransferItemList interface to access the file(s)
            [...event.dataTransfer!.items].forEach( (item, i) => {
                
                // If dropped items aren't files, reject them
                if ( item.kind === "file" )
                {
                    // Print file name.
                    const file = item.getAsFile();
                    window.console.log( `-> file[${i}].name = ${file!.name}` );
					
					// DMN Files, for the diagram
					if ( file && ( file.name.endsWith( ".dmn" ) || file.name.endsWith( ".XML" ) ) )
						displayDMN( file );

					// JSON Files, for the FEEL evaluation
					//else if ( file && ( file.name.endsWith( ".json" ) ) )
                		
				}
            } )
        }
        else
            throw new Error( "'dragAndDrop' >> ''dataTranser' in event', untrue." );
    }, false );

	document.addEventListener( 'dragleave', ( event: DragEvent ) => {
		window.console.log( "dragend" );
		event.preventDefault();
	}, false );
}

dragAndDrop();
