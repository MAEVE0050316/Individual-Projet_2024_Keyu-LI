let tpModel; // This will be your 3D model
let customFont; // Font for text rendering

let colors = []; // Array of colors from JSON
let fontColor = '#000000';
let backgroundColor = '#DCDCDC'; // Initial background color of the rectangle
let tpColor = '#FFFFFF';
let frame;

// The IDs here should match the HTML exactly
const fontColorDropZone = document.getElementById('fontColorDropZone');
const backgroundColorDropZone = document.getElementById('backgroundColorDropZone');
const tpColorDropZone = document.getElementById('tpColorDropZone');

function preload() {
  tpModel = loadModel('weishengzhi.obj', true);
  customFont = loadFont('font.ttf');
  frame = loadImage('frame.png');
  // Load the color palette and then initialize the color list after loading
  loadJSON('palette.json', function(loadedColors) {
    colors = loadedColors; // Now colors is populated with the loaded data
    initColorList(); // Call initColorList after the colors are loaded
  });
}


function setup() {
  //createCanvas(800, 600, WEBGL);
  createCanvas(windowWidth / 2, windowHeight, WEBGL);
  textSize(70);
  textFont(customFont);
  // Make sure colors is an array before calling forEach
  if (Array.isArray(colors)) {
    initColorList();
  }
  setupDropZones();
}

function draw() {
  background(255);
  directionalLight(255, 255, 255, 1, 1, -1);
  ambientLight(180);
  // Assuming the text and model should be centered in their half of the canvas
  let centerX = canvas.width / 4; // Half of the canvas width
  let modelX = centerX; // Center of the right half for the model


  // back：
  push();
  fill(backgroundColor); // Use the fontColor for the text
  noStroke();
  translate(-300, -400);
  rect(0, 0, 600,800);
  pop();

  // Draw the text with fontColor
  push();
  fill(fontColor); // Use the fontColor for the text
  textAlign(CENTER, CENTER);

  // The text should be centered in the left half of the canvas
  translate(0, 150);
  text('The world‘s \nmost expensive \ntoilet paper!', 0, 0);
  pop();

  // Position and draw the 3D model with tpColor
  push();
  translate(0, -150);
  rotateY(frameCount * 0.01);
  fill(tpColor); // Use the tpColor for the model
  noStroke();
  scale(1.5);
  model(tpModel);
  pop();

  //frame
  push();
  translate(-380, -500);
  image(frame,0,0,frame.width*2, frame.height*2);
  pop();


  //instructions:
  push();
  translate(-350,-550);
  textAlign(LEFT);
  textSize(20);
  fill(0);
  noStroke();
  text('Please drag the color name on the left into the box on the right, \nto customize your most expensive creation in the world!', 0, 0);
  pop();
}



function initColorList() {
  // No need to check if colors is an array here since we're calling it after loadJSON
  const colorListDiv = document.getElementById('colorList');
  colors.forEach(colorObj => {
    let div = document.createElement('div');
    div.className = 'colorOption';
    div.textContent = colorObj.name;
    div.draggable = true;
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.addEventListener('dragstart', function(event) {
      event.dataTransfer.setData('text/plain', JSON.stringify(colorObj));
    });
    colorListDiv.appendChild(div);
  });
  setupDropZones();
}

function setupDropZones() {
  // Get references to the drop zone elements
  const fontColorDropZone = document.getElementById('fontColorDropZone');
  const backgroundColorDropZone = document.getElementById('backgroundColorDropZone');
  const tpColorDropZone = document.getElementById('tpColorDropZone');

  // Add event listeners for dragover and drop events
  [fontColorDropZone, backgroundColorDropZone, tpColorDropZone].forEach(zone => {
    zone.addEventListener('dragover', event => event.preventDefault());

    zone.addEventListener('drop', event => {
      event.preventDefault();
      const colorObj = JSON.parse(event.dataTransfer.getData('text/plain'));
      if (zone === fontColorDropZone) {
        fontColor = colorObj.color;
      } else if (zone === backgroundColorDropZone) {
        backgroundColor = colorObj.color;
      } else if (zone === tpColorDropZone) {
        tpColor = colorObj.color;
      }
      redraw(); // This will trigger p5.js to redraw the canvas with new colors
    });
  });
}


function changeColor(colorData, varName) {
  const colorObj = JSON.parse(colorData);
  window[varName] = colorObj.color;
  redraw();
}