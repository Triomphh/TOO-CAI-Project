/*
    APIs: 
        HTML Drag and Drop API
        MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

        File API (for later)
        MDN : https://developer.mozilla.org/en-US/docs/Web/API/File
*/

import {DMN} from "./DMN";
import {displayDMN} from "./dmnViewer";


/*
    Drag & Drop Handler

    TO DO:
        - Maybe document.addEventListener is bad codding ?? (to check)
        - Loading the DOM and window correctly : http://109.26.178.21/fbarbier/Programming/TypeScript/TypeScript_DOM.html
        - Check 'else throw new Error...' if it's correct Error Handling
        - ...
*/


let dmn: DMN | null = null;


export const dragAndDrop = (): void => {

     // ...a dragged item enters a valid drop target
    document.addEventListener( 'dragenter', ( event: DragEvent ) => {
        // window.console.log( "dragenter" );
        // Prevent default behavior (prevent file from being opened)
        event.preventDefault();
    }, false );


    // ...a dragged item is being dragged over a valid drop target, every few hundred milliseconds
    document.addEventListener( 'dragover', ( event: DragEvent ) => {
        // window.console.log( "dragover" );
        event.preventDefault();
    }, false );


    // ...an item is dropped on a valid drop target
    document.addEventListener( 'drop', ( event: DragEvent ) => {
        event.preventDefault();

        if( 'dataTransfer' in event )
        {
			const item = event.dataTransfer!.items[0]; // Only take the first item

            // If dropped items aren't files, reject them
            if ( item.kind === "file" )
            {
                // Print file name.
                const file = item.getAsFile();
				
				// DMN Files, for the diagram
				if ( file && ( file.name.endsWith( ".dmn" ) || file.name.endsWith( ".XML" ) ) )
					handleDMNdrop( file );

				// JSON Files, for the FEEL evaluation
				else if ( file && ( file.name.endsWith( ".json" ) ) )
					if ( dmn )
            			handleJSONdrop( dmn, file );
			}
        }
        else
            throw new Error( "'dragAndDrop' >> ''dataTranser' in event', untrue." );
    }, false );

	document.addEventListener( 'dragleave', ( event: DragEvent ) => {
		// window.console.log( "dragend" );
		event.preventDefault();
	}, false );
}



//À VÉRIFIER
async function handleDMNdrop( file: File ): Promise<void>
{
	dmn = new DMN();
	await dmn.load( file );
	displayDMN( dmn );
}

async function handleJSONdrop( dmn: DMN, file: File ): Promise<void>
{
	await dmn.evaluate( file );
}
