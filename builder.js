const toolboxItems = document.querySelectorAll('.toolbox-item');
const canvas = document.getElementById('canvas');
const colorInput = document.getElementById('element-color');
const fontSizeInput = document.getElementById('element-font-size');
const marginInput = document.getElementById('element-margin');
const fontSelect = document.getElementById('element-font');
const boldCheckbox = document.getElementById('element-bold');
const backgroundColorInput = document.getElementById('background-color');

let selectedElement = null;

toolboxItems.forEach(item => {
    item.addEventListener('click', () => {
        const elementType = item.dataset.type;
        const newElement = document.createElement(elementType);

        // Customize styles based on element type
        if (elementType === 'heading') {
            newElement.innerText = 'New Heading';
        } else if (elementType === 'paragraph') {
            newElement.innerText = 'New Paragraph';
        } else if (elementType === 'image') {
            newElement.src = 'placeholder.jpg'; // Provide a placeholder image URL
            newElement.alt = 'Image';
        } else if (elementType === 'button') {
            newElement.innerText = 'Click me';
            newElement.addEventListener('click', () => {
                alert('Button Clicked!');
            });
        }

        newElement.className = 'canvas-element';
        newElement.setAttribute('draggable', true);
        newElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', elementType);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'delete-button'; // Add class to delete button
        deleteButton.addEventListener('click', () => {
            canvas.removeChild(newElement);
        });

        newElement.appendChild(deleteButton);

        newElement.addEventListener('click', () => {
            // Update selected element when clicked
            selectedElement = newElement;
            updatePropertiesPanel();
        });

        canvas.appendChild(newElement);
    });
});

canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    const newElement = document.createElement(elementType);

    // Customize styles based on element type
    if (elementType === 'heading') {
        newElement.innerText = 'New Heading';
    } else if (elementType === 'paragraph') {
        newElement.innerText = 'New Paragraph';
    } else if (elementType === 'image') {
        newElement.src = 'placeholder.jpg'; // Provide a placeholder image URL
        newElement.alt = 'Image';
    }

    newElement.className = 'canvas-element';
    newElement.setAttribute('draggable', true);
    newElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', elementType);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete-button'; // Add class to delete button
    deleteButton.addEventListener('click', () => {
        canvas.removeChild(newElement);
    });

    newElement.appendChild(deleteButton);

    newElement.addEventListener('click', () => {
        // Update selected element when clicked
        selectedElement = newElement;
        updatePropertiesPanel();
    });

    canvas.appendChild(newElement);
});

colorInput.addEventListener('input', updateElementStyles);
fontSizeInput.addEventListener('input', updateElementStyles);
marginInput.addEventListener('input', updateElementStyles);
fontSelect.addEventListener('change', updateElementStyles);
boldCheckbox.addEventListener('change', updateElementStyles);

function updateElementStyles() {
    if (selectedElement) {
        selectedElement.style.color = colorInput.value;
        selectedElement.style.fontSize = fontSizeInput.value + 'px';
        selectedElement.style.margin = marginInput.value + 'px';
        selectedElement.style.fontFamily = fontSelect.value;
        selectedElement.style.fontWeight = boldCheckbox.checked ? 'bold' : 'normal';
    }
}

function updatePropertiesPanel() {
    // Update properties panel based on selected element
    if (selectedElement) {
        colorInput.value = selectedElement.style.color || '#000000';
        fontSizeInput.value = parseInt(selectedElement.style.fontSize) || 16;
        marginInput.value = parseInt(selectedElement.style.margin) || 0;
        fontSelect.value = selectedElement.style.fontFamily || 'Arial';
        boldCheckbox.checked = selectedElement.style.fontWeight === 'bold';
        backgroundColorInput.value = selectedElement.style.backgroundColor || '#ffffff';
    }
}

document.getElementById('download-button').addEventListener('click', () => {
    const canvasContent = document.getElementById('canvas').cloneNode(true);

    // Remove delete buttons from the cloned canvas
    const deleteButtons = canvasContent.getElementsByClassName('delete-button');
    while (deleteButtons.length > 0) {
        deleteButtons[0].parentNode.removeChild(deleteButtons[0]);
    }

    // Basic HTML structure
    const sourceCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generated Website</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }

                #builder {
                    display: flex;
                    height: 100vh;
                }

                #toolbox {
                    width: 20%;
                    background-color: #f4f4f4;
                    padding: 20px;
                    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                }

                #canvas-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                #canvas {
                    flex: 1;
                    padding: 20px;
                    position: relative;
                }

                #properties-panel {
                    background-color: #f4f4f4;
                    padding: 10px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    margin-top: 20px;
                }

                .toolbox-item {
                    padding: 10px;
                    background-color: #3498db;
                    color: #fff;
                    margin-bottom: 10px;
                    cursor: pointer;
                }

                .canvas-element {
                    margin-bottom: 10px;
                    position: relative;
                }
            </style>
            <style>
                ${getCustomStyles()}
            </style>
        </head>
        <body>
            ${canvasContent.outerHTML}
        </body>
        </html>
    `;

    // Create a blob and initiate download
    const blob = new Blob([sourceCode], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'generated_website.html';
    link.click();
});

function getCustomStyles() {
    // Generate custom styles for all canvas elements
    const canvasElements = document.querySelectorAll('.canvas-element');
    let customStyles = '';

    canvasElements.forEach(element => {
        customStyles += `
            .${element.className.replace(/\s+/g, '.')}:not(.delete-button) {
                color: ${element.style.color || 'inherit'};
                font-size: ${element.style.fontSize || 'inherit'};
                margin: ${element.style.margin || 'inherit'};
                font-family: ${element.style.fontFamily || 'inherit'};
                font-weight: ${element.style.fontWeight || 'inherit'};
                background-color: ${element.style.backgroundColor || 'inherit'};
            }
        `;
    });

    return customStyles;
}


backgroundColorInput.addEventListener('input', () => {
    canvas.style.backgroundColor = backgroundColorInput.value;
});

// Save/Load Functionality
document.getElementById('save-button').addEventListener('click', function() {
    localStorage.setItem('builderState', JSON.stringify(builderState));
    alert('Builder state saved.');
});

document.getElementById('load-button').addEventListener('click', function() {
    const savedState = localStorage.getItem('builderState');
    if (savedState) {
        builderState = JSON.parse(savedState);
        // Implement logic to restore elements on the canvas
        alert('Builder state loaded.');
    } else {
        alert('No saved state found.');
    }
});
