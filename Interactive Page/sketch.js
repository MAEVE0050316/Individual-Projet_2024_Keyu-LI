//interactive page from "The most expensive toilet paper in the world", Keyu LI, 2024,
//This is the interactive page;
//After your downloading the JSON file from the color paleette generation code you can put it here;
//And then, run the code.
//Have a fun!!!

let tpModel; 
let customFont; 

let colors = []; 
let fontColor = '#000000';
let backgroundColor = '#DCDCDC'; 
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

  loadJSON('palette.json', function(loadedColors) {
    colors = loadedColors; 
    initColorList(); 
  });
}


function setup() {
  createCanvas(windowWidth / 2, windowHeight, WEBGL);
  textSize(70);
  textFont(customFont);

  if (Array.isArray(colors)) {
    initColorList();
  }
  setupDropZones();
}

function draw() {
  background(255);
  directionalLight(255, 255, 255, 1, 1, -1);
  let centerX = canvas.width / 4; 
  let modelX = centerX; 


  // back：
  push();
  fill(backgroundColor); 
  noStroke();
  translate(-300, -400);
  rect(0, 0, 600,800);
  pop();
  push();
  fill(fontColor); 
  textAlign(CENTER, CENTER);
  translate(0, 150);
  text('The world‘s \nmost expensive \ntoilet paper!', 0, 0);
  pop();

  push();
  translate(0, -150);
  rotateY(frameCount * 0.01);
  fill(tpColor); 
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
  const fontColorDropZone = document.getElementById('fontColorDropZone');
  const backgroundColorDropZone = document.getElementById('backgroundColorDropZone');
  const tpColorDropZone = document.getElementById('tpColorDropZone');
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
      redraw(); 
    });
  });
}


function changeColor(colorData, varName) {
  const colorObj = JSON.parse(colorData);
  window[varName] = colorObj.color;
  redraw();
}