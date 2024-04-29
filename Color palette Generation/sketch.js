document.addEventListener('DOMContentLoaded', (event) => {

let currentImageIndex = 0;
const imagePaths = [
    'pic/1.png',
    'pic/2.png',
    'pic/3.png',
    'pic/4.png',
    'pic/5.png',
    'pic/6.png',
    'pic/7.png',
    'pic/8.png',
    'pic/9.png',
];
const colorNames = {};
const palettes = {}; // Stores a separate palette for each image
const globalPalette = {}; 

function setup() {
  noCanvas();
  loadImageAndPalette();
}

function loadImageAndPalette() {
    if (currentImageIndex < imagePaths.length) {
        const imagePath = imagePaths[currentImageIndex];
        const img = new Image(); // Create a new Image object
        img.onload = () => {
            processImage(img); // Call function to process the image once it's loaded
        };
        img.src = imagePath; // Set the source path which triggers the loading
        document.getElementById('currentImage').src = imagePath; // Display the image in the browser
    } else {
        console.log("All images processed. Saving palette...");
        downloadPalette(); // Save the consolidated and unique palette
    }
}

function processImage(img) {
    // Create a canvas element that's the same size as the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Now that we have the image data, we can process it
    extractColorsAndCreatePalette(imageData, 40);
}

function extractColorsAndCreatePalette(imageData, maxColors) {
    const colors = {};
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        if (a !== 0) { // Only process fully opaque pixels
            const key = `${r}-${g}-${b}`;
            colors[key] = (colors[key] || 0) + 1;
        }
    }

    console.log('Raw color counts', colors);

    const sortedColors = Object.keys(colors).sort((a, b) => colors[b] - colors[a]).slice(0, maxColors);
    console.log('Top Colors:', sortedColors);
    updateGlobalPalette(sortedColors, colors);

    displayPalette(sortedColors); // Only display the current image's palette

    currentImageIndex++;

}

function updateGlobalPalette(sortedColors, colors) {
    sortedColors.forEach(colorKey => {
        if (!globalPalette[colorKey]) {
            globalPalette[colorKey] = { count: 0, color: `rgb(${colorKey.replace(/-/g, ',')})` };
        }
        globalPalette[colorKey].count += colors[colorKey];
    });

    console.log('Global Palette:', globalPalette);
}
  
function displayPalette(sortedColors) {
    const paletteContainer = document.getElementById('palette');
    paletteContainer.innerHTML = ''; // This clears the palette container

    sortedColors.forEach(colorKey => {
        const rgbColor = `rgb(${colorKey.replace(/-/g, ',')})`;
        console.log('Color to be displayed:', rgbColor);

        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = rgbColor;
        colorDiv.className = 'color';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Emotional name';
        nameInput.value = colorNames[rgbColor] || '';
        nameInput.onchange = function() {
            colorNames[rgbColor] = nameInput.value;
            saveColorNames();
        };

        const colorContainer = document.createElement('div');
        colorContainer.appendChild(colorDiv);
        colorContainer.appendChild(nameInput);
        paletteContainer.appendChild(colorContainer);
    });
}

// Save the emotional names
function saveColorNames() {
    localStorage.setItem('colorNames', JSON.stringify(colorNames));
}

// Assuming you have a button with the ID 'nextButton' in your HTML:
document.getElementById('nextButton').addEventListener('click', loadNextImage);

function showDownloadButton() {
    let downloadButton = document.createElement('button');
    downloadButton.id = 'downloadButton';
    downloadButton.innerText = 'Download Palette';
    downloadButton.addEventListener('click', downloadPalette);
    document.body.appendChild(downloadButton);
  }
  
  function loadNextImage() {
    if (currentImageIndex < imagePaths.length) {
      loadImageAndPalette();
    } else {
      console.log("All images processed");
      showDownloadButton(); // Now the button is created only after all images are processed
    }
  }

function downloadPalette() {
    // Inside downloadPalette function
    const paletteArray = Object.entries(globalPalette).map(([key, value]) => {
        // Ensure the color is formatted correctly
        const rgbColor = `rgb(${key.replace(/-/g, ',')})`;
        return {
            color: rgbColor,
            count: value.count,
            name: colorNames[rgbColor] || 'Unnamed' // Make sure to fetch the name using rgbColor
        };
    });


    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paletteArray, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "palette.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
}

  // Start processing the first image
  loadImageAndPalette();
});