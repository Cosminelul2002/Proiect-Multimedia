'use restrict';


// Declaratios
const canvasImage = document.getElementById('canvasImg');
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

// Draw image method
const drawImage = (image) => {
    console.log(image.width);
    canvasImage.width = image.naturalWidth;
    canvasImage.height = image.naturalHeight;

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
            const image = document.createElement('img');
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
});

canvasImage.addEventListener('click', function (event) {
    var x = event.offsetX;
    var y = event.offsetY;

    // Calculați dimensiunile zonei selectate
    var width = 100;
    var height = 100;

    // Obțineți datele pixelilor din zona selectată
    var ctx = canvasImage.getContext('2d');
    var imageData = ctx.getImageData(x, y, width, height);
    var data = imageData.data;

    // Aplicați efectul de întunecare pe fiecare pixel din zona selectată
    for (var i = 0; i < data.length; i += 4) {
        data[i] = data[i] / 2; // R
        data[i + 1] = data[i + 1] / 2; // G
        data[i + 2] = data[i + 2] / 2; // B
    }

    // Redesenați imaginea modificată în canvas
    ctx.putImageData(imageData, x, y);
});
