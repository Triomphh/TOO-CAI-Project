/*
    APIs: 
        HTML Drag and Drop API
        MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

        File API (for later)
        MDN : https://developer.mozilla.org/en-US/docs/Web/API/File
*/




const dragAndDrop = (): void => {
     // ...a dragged item enters a valid drop target
    document.addEventListener( 'dragenter', ( event: DragEvent ) => {
        window.console.log("dragenter");
        // Prevent default behavior (prevent file from being opened)
        event.preventDefault();
    }, false );


    // ...a dragged item is being dragged over a valid drop target, every few hundred milliseconds
    document.addEventListener( 'dragover', ( event: DragEvent ) => {
        window.console.log("dragover");
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
                }

            } )
        }
        else
            throw new Error( "'dragAndDrop' >> ''dataTranser' in event', untrue." );
    }, false );
}

dragAndDrop();