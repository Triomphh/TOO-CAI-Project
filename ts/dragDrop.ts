/*
    APIs: 
        HTML Drag and Drop API
        MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

        File API (for later)
        MDN : https://developer.mozilla.org/en-US/docs/Web/API/File
*/

import {DMN} from "./DMN";
import {displayDMN} from "./dmnViewer";



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



async function handleDMNdrop( file: File ): Promise<void>
{
	// Clear all previous data
	const topInfosH1: HTMLElement | null = document.getElementById( 'top-infos-h1' );
	if ( topInfosH1 )
		topInfosH1.textContent = " Drag & drop your .DMN file "; 

	const diagramContainer: HTMLElement | null = document.getElementById( 'diagram-container' );
	if ( diagramContainer )
		diagramContainer.replaceChildren();

	const jsonViewer: HTMLElement | null = document.getElementById( 'json-viewer' );
	if ( jsonViewer )
		jsonViewer.textContent = "";

	const htmlResult: HTMLElement | null = document.getElementById( 'results-container' );
	if ( htmlResult )
		htmlResult.textContent = "";
	

	dmn = new DMN();
	await dmn.load( file );
	displayDMN( dmn );

	
	// Modify top text to guide the user.
	const htmlText: HTMLElement | null = document.getElementById( 'top-infos-h1' );
	if ( htmlText )
		htmlText.textContent = " Drag & drop your .JSON file ";
}



async function handleJSONdrop( dmn: DMN, file: File ): Promise<void>
{
	const evaluationResult = await dmn.evaluate( file );
	

	const topInfosH1: HTMLElement | null = document.getElementById( 'top-infos-h1' );
	if ( topInfosH1 )
		topInfosH1.textContent = " See the results. "; 


	const htmlResult: HTMLElement | null = document.getElementById( 'results-container' );
	if ( htmlResult )
		htmlResult.textContent = JSON.stringify( evaluationResult );
}
