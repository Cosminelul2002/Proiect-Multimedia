'use restrict';


// Declaratios
const canvasImage = document.getElementById('canvasImg');
const ctx = canvasImage.getContext('2d');
image = document.createElement('img');
clearImage = document.createElement('img');
const uploadButton = document.getElementById('imgUpload');
const canvasWidth = canvasImage.width;
const canvasHeight = canvasImage.height;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let effect;

// Draw image method
const drawImage = (image) => {
    canvasImage.width = image.width;
    canvasImage.height = image.height;

    const ctx = canvasImage.getContext('2d');
    ctx.drawImage(image, 0, 0);
};


// Drag and drop event
document.addEventListener('dragover', (event) => {
    event.preventDefault();
});
document.addEventListener('drop', (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files;

    if (file.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            image.addEventListener('load', () => {
                drawImage(image);
            });
            image.setAttribute('src', event.target.result);
            clearImage.setAttribute('src', event.target.result);
        });

        reader.readAsDataURL(file[0]);
    }
});

// Upload button event
const uploadImage = (event) => {
    const file = event.target.files;
    if (file.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const image = document.createElement('img');
            image.addEventListener('load', () => {
                drawImage(image);
            });
            image.setAttribute('src', event.target.result);
        });

        reader.readAsDataURL(file[0]);
    }
};

uploadButton.addEventListener('click', (event) => {
    document.getElementById('inputImg').click();
    document.getElementById('inputImg').addEventListener('change', uploadImage);
});

// Button to reset the canvas
const resetCanvas = document.getElementById('clearCanvas');
resetCanvas.addEventListener('click', () => {
    const ctx = canvasImage.getContext('2d');
    // Reset width and height
    canvasImage.width = canvasWidth;
    canvasImage.height = canvasHeight;
    ctx.clearRect(0, 0, canvasImage.width, canvasImage.height);
    image.src = clearImage.src;
    drawImage(image);
});

let startX = 0;
let startY = 0;
let effectFlag = false;
let deleteFlag = false;
let resizeFlag = false;
let addTextFlag = false;
let selectedArea;

// Mouse events for the canvas
function mouseDown(event) {
    isDragging = true;
    startX = event.offsetX;
    startY = event.offsetY;
}

function mouseMove(event) {
    if (isDragging) {
        ctx.clearRect(0, 0, canvasImage.width, canvasImage.height);
        drawImage(image);
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(startX, startY, event.offsetX - startX, event.offsetY - startY);
    }
}

function mouseUpEffect(event) {
    isDragging = false;
    // selectedArea = ctx.getImageData(startX, startY, event.offsetX - startX, event.offsetY - startY);
    applyEffectOnSelectedArea(image, startX, startY, event.offsetX, event.offsetY, effect);
    image.src = canvasImage.toDataURL();
}

function mouseUpDelete(event) {
    isDragging = false;
    deleteSelectedArea(image, startX, startY, event.offsetX, event.offsetY);
    image.src = canvasImage.toDataURL();
}

document.getElementById('imgSelect').addEventListener('click', () => {
    if (deleteFlag) {
        alert('Delete area is active!');
    } else {
        if (effectFlag == false) {
            document.getElementById('imgSelect').style.backgroundColor = '#369';

            document.getElementById('imgSelect').addEventListener('mouseover', () => {
                document.getElementById('imgSelect').style.backgroundColor = '#369';
            });

            document.getElementById('imgSelect').addEventListener('mouseout', () => {
                document.getElementById('imgSelect').style.backgroundColor = '#369';
            });

            canvasImage.addEventListener('mousedown', mouseDown);
            canvasImage.addEventListener('mousemove', mouseMove);
            canvasImage.addEventListener('mouseup', mouseUpEffect);

            effectFlag = true;
        } else {

            document.getElementById('imgSelect').style.backgroundColor = '#036';

            document.getElementById('imgSelect').addEventListener('mouseover', () => {
                document.getElementById('imgSelect').style.backgroundColor = '#369';
            });

            document.getElementById('imgSelect').addEventListener('mouseout', () => {
                document.getElementById('imgSelect').style.backgroundColor = '#036';
            });

            console.log('remove event listeners');

            canvasImage.removeEventListener('mousedown', mouseDown);
            canvasImage.removeEventListener('mousemove', mouseMove);
            canvasImage.removeEventListener('mouseup', mouseUpEffect);

            effectFlag = false;
        }
    }
});

document.getElementById('imgDelete').addEventListener('click', () => {
    if (effectFlag) {
        alert('Select area for choosing effect is active!');
    } else {
        if (deleteFlag == false) {

            document.getElementById('imgDelete').style.backgroundColor = '#369';

            document.getElementById('imgDelete').addEventListener('mouseover', () => {
                document.getElementById('imgDelete').style.backgroundColor = '#369';
            });

            document.getElementById('imgDelete').addEventListener('mouseout', () => {
                document.getElementById('imgDelete').style.backgroundColor = '#369';
            });

            canvasImage.addEventListener('mousedown', mouseDown);
            canvasImage.addEventListener('mousemove', mouseMove);
            canvasImage.addEventListener('mouseup', mouseUpDelete);

            deleteFlag = true;

        } else {

            document.getElementById('imgDelete').style.backgroundColor = '#036';

            document.getElementById('imgDelete').addEventListener('mouseover', () => {
                document.getElementById('imgDelete').style.backgroundColor = '#369';
            });
            document.getElementById('imgDelete').addEventListener('mouseout', () => {
                document.getElementById('imgDelete').style.backgroundColor = '#036';
            });


            canvasImage.removeEventListener('mousedown', mouseDown);
            canvasImage.removeEventListener('mousemove', mouseMove);
            canvasImage.removeEventListener('mouseup', mouseUpDelete);

            deleteFlag = false;

        }
    }
});


deleteSelectedArea = (image, startX, startY, endX, endY) => {
    // Set the canvas size to the size of the image
    canvasImage.width = image.width;
    canvasImage.height = image.height;

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0);

    // Clip the canvas to the selected area
    ctx.save();
    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.clip();

    // Clear the selected area
    ctx.clearRect(startX, startY, endX - startX, endY - startY);

    // Restore the canvas
    ctx.restore();
};

document.getElementById('imgEffect').addEventListener('click', () => {
    document.getElementById('effectList').style.display = 'block';
});

document.getElementById('list').addEventListener('change', () => {
    effect = document.getElementById('list').value;
});

function applyEffectOnSelectedArea(image, startX, startY, endX, endY, effect) {
    // Set the canvas size to the size of the image
    canvasImage.width = image.width;
    canvasImage.height = image.height;

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0);

    // Clip the canvas to the selected area
    ctx.save();
    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.clip();

    // Apply the desired effect on the clipped region
    switch (effect) {
        case 'grayscale':
            ctx.filter = 'grayscale(100%)';
            break;
        case 'sepia':
            ctx.filter = 'sepia(100%)';
            break;
        case 'invert':
            ctx.filter = 'invert(100%)';
            break;
        case 'blur':
            ctx.filter = 'blur(5px)';
            break;
        case 'brightness':
            ctx.filter = 'brightness(200%)';
            break;
        case 'contrast':
            ctx.filter = 'contrast(200%)';
            break;
        case 'hue-rotate':
            ctx.filter = 'hue-rotate(90deg)';
            break;
        case 'saturate':
            ctx.filter = 'saturate(200%)';
            break;
        case 'opacity':
            ctx.filter = 'opacity(50%)';
            break;
        default:
            break;
    }

    // Draw the image on the canvas again to apply the effect
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}

let inputText;
let inputColor;
let inputSize;
let inputPositionX;
let inputPositionY;

document.getElementById('imgText').addEventListener('click', () => {
    if ( addTextFlag ) {
    document.getElementById('inputContainer').style.display = 'flex';

    addTextFlag = false;
    } else {
        document.getElementById('inputContainer').style.display = 'none';
        addTextFlag = true;
    }
});

document.getElementById('text').addEventListener('change', () => {
    inputText = document.getElementById('text').value;
    console.log(inputText);
});

document.getElementById('color').addEventListener('change', () => {
    inputColor = document.getElementById('color').value;
    console.log(inputColor);
});

document.getElementById('size').addEventListener('change', () => {
    inputSize = document.getElementById('size').value;
    console.log(inputSize);
});

document.getElementById('x').addEventListener('change', () => {
    inputPositionX = document.getElementById('x').value;
});

document.getElementById('y').addEventListener('change', () => {
    inputPositionY = document.getElementById('y').value;
});


document.getElementById('addText').addEventListener('click', (event) => {
    event.preventDefault();
    ctx.font = `${inputSize}px Arial`;
    ctx.fillStyle = inputColor;
    if (inputPositionX > canvasImage.width || inputPositionY > canvasImage.height) {
        alert('The text is outside the canvas');
    } else {
        ctx.fillText(inputText, inputPositionX, inputPositionY);
    }
    // Save image for later use
    image.src = canvasImage.toDataURL();
});

document.getElementById('imgSave').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvasImage.toDataURL();
    link.click();
});

let inputWidth;
let inputHeight;

document.getElementById('imgResize').addEventListener('click', () => {
    document.getElementById('resizeInput').style.display = 'flex';
});

document.getElementById('width').addEventListener('change', () => {
    inputWidth = document.getElementById('width').value;
});

document.getElementById('height').addEventListener('change', () => {
    inputHeight = document.getElementById('height').value;
});

document.getElementById('imgResize').addEventListener('click', () => {
    if (resizeFlag) {

        document.getElementById('imgResize').style.backgroundColor = '#036';

        document.getElementById('imgResize').addEventListener('mouseover', () => {
            document.getElementById('imgResize').style.backgroundColor = '#369';
        });
        document.getElementById('imgResize').addEventListener('mouseout', () => {
            document.getElementById('imgResize').style.backgroundColor = '#036';
        });

        document.getElementById('resizeInput').style.display = 'none';

        resizeFlag = false;

    } else {

        document.getElementById('imgResize').style.backgroundColor = '#369';

        document.getElementById('imgResize').addEventListener('mouseover', () => {
            document.getElementById('imgResize').style.backgroundColor = '#369';
        });

        document.getElementById('imgResize').addEventListener('mouseout', () => {
            document.getElementById('imgResize').style.backgroundColor = '#369';
        });

        resizeFlag = true;

    }
});


document.getElementById('resize').addEventListener('click', () => {

    const aspectRatio = image.width / image.height;
    console.log(aspectRatio);
    console.log(inputWidth);
    console.log(inputHeight);
    if (inputWidth === undefined && inputHeight === undefined) {
        alert('Please enter a value for width or height');
    } else if (inputWidth === undefined) {
        inputWidth = inputHeight * aspectRatio;
    } else if (inputHeight === undefined) {
        inputHeight = inputWidth / aspectRatio;
    }
    // Draw the new image on the canvas
    canvasImage.width = inputWidth;
    canvasImage.height = inputHeight;
    ctx.drawImage(image, 0, 0, inputWidth, inputHeight);
    // Save image for later use
    image.src = canvasImage.toDataURL();

});
