'use restrict';


// Declaratios
const canvasImage = document.getElementById('canvasImg');
const ctx = canvasImage.getContext('2d');
image = document.createElement('img');
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
    // image.src = canvasImage.toDataURL();
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
    drawImage(image);
});

// canvasImage.addEventListener('click', function (event) {
//     var x = event.offsetX;
//     var y = event.offsetY;

//     // Calculați dimensiunile zonei selectate
//     var width = 100;
//     var height = 100;

//     // Obțineți datele pixelilor din zona selectată
//     var ctx = canvasImage.getContext('2d');
//     var imageData = ctx.getImageData(x, y, width, height);
//     var data = imageData.data;

//     // Aplicați efectul de întunecare pe fiecare pixel din zona selectată
//     for (var i = 0; i < data.length; i += 4) {
//         data[i] = data[i] / 2; // R
//         data[i + 1] = data[i + 1] / 2; // G
//         data[i + 2] = data[i + 2] / 2; // B
//     }

//     // Redesenați imaginea modificată în canvas
//     ctx.putImageData(imageData, x, y);
// });

let startX = 0;
let startY = 0;
let selectedArea;

document.getElementById('imgSelect').addEventListener('click', () => {
    canvasImage.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.offsetX;
        startY = event.offsetY;
    });
    canvasImage.addEventListener('mousemove', (event) => {
        if (isDragging) {
            ctx.clearRect(0, 0, canvasImage.width, canvasImage.height);
            drawImage(image);
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(startX, startY, event.offsetX - startX, event.offsetY - startY);
        }
    });
    canvasImage.addEventListener('mouseup', (event) => {
        isDragging = false;
        console.log(effect);
        // Obțineți datele pixelilor din zona selectată
        selectedArea = ctx.getImageData(startX, startY, event.offsetX - startX, event.offsetY - startY);
        applyEffectOnSelectedArea(image, startX, startY, event.offsetX, event.offsetY, effect);
    });
});

// delete the selected area
document.getElementById('imgDelete').addEventListener('click', () => {
    canvasImage.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.offsetX;
        startY = event.offsetY;
    });
    canvasImage.addEventListener('mousemove', (event) => {
        if (isDragging) {
            ctx.clearRect(0, 0, canvasImage.width, canvasImage.height);
            drawImage(image);
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(startX, startY, event.offsetX - startX, event.offsetY - startY);
        }
    });
    canvasImage.addEventListener('mouseup', (event) => {
        isDragging = false;
        deleteSelectedArea(image, startX, startY, event.offsetX, event.offsetY);
    });
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
    document.getElementById('inputContainer').style.display = 'flex';
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
});

document.getElementById('imgSave').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvasImage.toDataURL();
    link.click();
});