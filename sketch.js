/*  Homage to Mezquita--Simulator of lattice and perspective, 
 *  2026/02/18, version 0.2, snow00two,
 * \href{https://creativecommons.org/licenses/by-nc-nd/4.0/}{\ccbyncsa}
 */
const WIDTH_CANVAS = 720 * 3/2  ; //=1080
const HEIGHT_CANVAS = 405 * 3/2 ; //=607.5
const BACK_COLOR = [150, 200, 255] ;//[150, 200, 250]
const FLOOR_COLOR = [250, 200, 155] ;//[250, 150, 150]
const WHITE_COLOR = 255;//=2^8-1
const LATTICE_SIZE = 150 ;
const I = 30; //dimension of lattice 30

let selectMode ;
let selectLattice ;
//let selectDir ;
let setYcoordinate ;
//let setZcoordinate ;
let setCameraHeight ;
let setHeightLight ;
let setFigure ;
let floorState ;
//let setSpeed ;
let setobliqueLatticeX ;
let setobliqueLatticeY ;
let lightState;

//p5.disableFriendlyErrors = true;

function setup() {
  selectMode = createSelect() ;
  selectMode.option('flight mode', 'flight') ; /* auto moving mode */
  selectMode.option('rotation mode', 'rotation') ; /*  auto rotation mode */
  selectMode.option('manual mode', 'manual') ;/* manual mode */
  selectMode.selected('flight') ;
  selectMode.position(WIDTH_CANVAS -130, 50) ;
  selectMode.changed( resetBackground ) ;

  floorState = createSelect() ;
  floorState.option('floor on', 'on') ;
  floorState.option('floor off', 'off') ;
  floorState.selected('on') ;
  floorState.position(WIDTH_CANVAS -80, 140) ;
  floorState.changed( resetBackground ) ;

  setFigure = createSelect() ;
  setFigure.option('column', 'column') ; /*  column */
  setFigure.option('box', 'box') ; /* box */
  setFigure.option('ball', 'ball') ; /* ball */
  setFigure.selected('column') ;
  setFigure.position(WIDTH_CANVAS -80, 80) ;
  setFigure.changed( resetBackground ) ;

  selectLattice = createSelect() ;
  selectLattice.option('square', 'square') ; /*  square lattice */
  selectLattice.option('hexagonal', 'hexagon') ; /* hexagonal lattice */
  selectLattice.option('rhombic', 'rhombic') ; /* rhombic lattice */
  selectLattice.option('oblique', 'oblique') ; /* oblique lattice and rectangular lattice when genY = 0 */
  selectLattice.selected('square') ;
  selectLattice.position(WIDTH_CANVAS - 105, 20) ;
  selectLattice.changed( resetBackground ) ;

  lightState =  createSelect() ;
  lightState.option('lamp on', 'on') ; 
  lightState.option('lamp off', 'off') ; 
  lightState.selected('on');
  lightState.position(WIDTH_CANVAS - 86, 110) ;
 
  // setZcoordinate = createSlider(-200, 400, 100, 0) ; /* set the z-angle */
  // setZcoordinate.position(WIDTH_CANVAS + 30, 140) ;
  // setZcoordinate.changed( resetBackground ) ;

  // selectDir = createSlider(0, 6, 3, 0) ; /* set the angle */
  // selectDir.position(WIDTH_CANVAS + 30, 160) ;
  // selectDir.changed( resetBackground ) ;

  // setSpeed = createSlider(0.5, 4, 2, 0) ;
  // setSpeed.position(WIDTH_CANVAS + 30, 180) ;
  // setSpeed.changed( resetBackground ) ;

  setobliqueLatticeX = createSlider(0, 1, 0, 0) ;
  setobliqueLatticeX.position(WIDTH_CANVAS -130, 200) ;
  setobliqueLatticeX.changed( resetBackground ) ;

  setobliqueLatticeY = createSlider(0.5, 3, 1.7, 0) ; /*We use this parameter for rhombic latice too*/
  setobliqueLatticeY.position(WIDTH_CANVAS -130, 220) ;
  setobliqueLatticeY.changed( resetBackground ) ;

  setCameraHeight = createSlider(30, 3000, 100, 0) ;
  setCameraHeight.position(WIDTH_CANVAS -130, 280) ;
  setCameraHeight.changed( resetBackground ) ;

  setYcoordinate = createSlider(-200, 200, 0, 0) ; /* set  */
  setYcoordinate.position(WIDTH_CANVAS -130, 300) ;
  setYcoordinate.changed( resetBackground ) ;

  setHeightLight = createSlider(0, 300, 180, 0) ;
  setHeightLight.position(WIDTH_CANVAS - 130, 180) ;
  setHeightLight.changed( resetBackground ) ;

  createCanvas(WIDTH_CANVAS, HEIGHT_CANVAS, WEBGL);
  background(BACK_COLOR);// 
}

function draw(){
  let cameraX = 0;
  let cameraY = setYcoordinate.value() ;
  let cameraZ = setCameraHeight.value();
  let targetX ;
  let targetY ;
  let targetZ = 100 ;//let targetZ = setZcoordinate.value() ;
  let latticeMode = selectLattice.value();
  let baseFigure = setFigure.value()
  const ANGLE_DIR = 3;//let angleDir = selectDir.value();
  let modeTmp =selectMode.value() ;
  const FLIGHT_SPEED = 3;//let flightSpeed = setSpeed.value();
  let genX = setobliqueLatticeX.value();
  let genY = setobliqueLatticeY.value();
  let upperDistance =  LATTICE_SIZE ;
  let depthFloor = 2 * LATTICE_SIZE * I;
  let heightLight = setHeightLight.value();
  let lightSwitch = lightState.value();

  //The world coordinates : 
  background(BACK_COLOR);//100,100,200
  directionalLight(300, 200, 300, 0, -1, -1); //light from the sun 
 // fill(250, 150, 150);

  let floorS = floorState.value() ;
  if (floorS == 'on') {
    fill(FLOOR_COLOR);
    plane(depthFloor,2 * LATTICE_SIZE * I,10,10);
  } else {
    ;
  }

 // ambientMaterial(125);
 // ambientLight(100,100,100);
 // shininess(100.0);
 // specularColor(150,150,150);
  
  if (modeTmp == 'rotation'){
    //The camera coordinates
    targetX = cos(frameCount * 0.002 * FLIGHT_SPEED)* 300 ;
    targetY = sin(frameCount * 0.002 * FLIGHT_SPEED)* 300 ;
    camera(cameraX,cameraY, cameraZ, targetX, targetY, targetZ, 0 , 0, -1);

    drawLattice(I,latticeMode,baseFigure,genX,genY, lightSwitch, heightLight);

  } else if (modeTmp == 'flight'){
    if (frameCount < upperDistance){
      ;
    } else {
      frameCount = 0 ;
    }
    //The camera coordinates
    targetX = FLIGHT_SPEED * frameCount + 300 ; 
    targetY = 0 ;
    cameraX = FLIGHT_SPEED * frameCount;
    camera(cameraX,cameraY, cameraZ, targetX, targetY, targetZ, 0 , 0, -1);

    drawLattice(I,latticeMode,baseFigure,genX,genY, lightSwitch, heightLight);

  } else if (modeTmp == 'manual'){
    //The camera coordinates
    targetX = 500 * cos(ANGLE_DIR);
    targetY = 500 * sin(ANGLE_DIR);
    camera(cameraX, cameraY, cameraZ, targetX, targetY, targetZ, 0, 0, -1);

    drawLattice(I,latticeMode,baseFigure,genX,genY, lightSwitch, heightLight);
  }  
}

// The modeling coordinates :
function drawLattice(dimL,latticeModeS,baseFigure,genX,genY,lightSwitch,heightLight){
    translate(0,-LATTICE_SIZE /2,0);//calibration for the viewpoint 
    if (latticeModeS == 'square') {
      translate(-LATTICE_SIZE * dimL,-LATTICE_SIZE * dimL,0);
      for(let i = 0 ; i < 2 * dimL ; i++){
        for(let j= 0 ; j < 2 * dimL ; j++){
          translate(LATTICE_SIZE,0,0);
          figure(baseFigure);
          translate(LATTICE_SIZE/2,LATTICE_SIZE/2,heightLight);
          lamP(lightSwitch);
          translate(-LATTICE_SIZE/2,-LATTICE_SIZE/2,-heightLight);
        }
        translate(-2 * LATTICE_SIZE * dimL,LATTICE_SIZE,0);
      }
    } else if(latticeModeS == 'rhombic') {//dimL=>dimL/2 for relaxing computational load
      translate(-LATTICE_SIZE * dimL/2,- genY *LATTICE_SIZE * dimL/2,0);
      for(let i = 0 ; i < 2* dimL ; i++){
        for(let j= 0 ; j <  dimL ; j++){
          figure(baseFigure);//
          translate(LATTICE_SIZE/2,genY*LATTICE_SIZE/2,0);//
          figure(baseFigure);//
          translate(-LATTICE_SIZE/4,-genY*LATTICE_SIZE/4,heightLight);//
          lamP(lightSwitch);
          translate(0,genY*LATTICE_SIZE/2,0);
          lamP(lightSwitch);
          translate(LATTICE_SIZE/2,0,0);
          lamP(lightSwitch);//
          translate(0,-genY*LATTICE_SIZE/2,0);//
          lamP(lightSwitch);
          translate(LATTICE_SIZE/4,-genY*LATTICE_SIZE/4,-heightLight);
        }
        translate(- LATTICE_SIZE * dimL,genY*LATTICE_SIZE/2,0);
      }
    } else if ( latticeModeS == 'hexagon' ) {
      translate(-LATTICE_SIZE * dimL,-  sqrt(3)*LATTICE_SIZE * dimL/2  ,0);
      for(let i = 0 ; i < 2 * dimL ; i++){
        for(let j= 0 ; j < 2 * dimL ; j++){
          figure(baseFigure);
          translate(LATTICE_SIZE/2, LATTICE_SIZE/(sqrt(3)*2),heightLight);
          lamP(lightSwitch);
          translate(LATTICE_SIZE/2, LATTICE_SIZE/(sqrt(3)*2),0);
          lamP(lightSwitch);
          translate(0,-LATTICE_SIZE/sqrt(3),-heightLight);
        }
        translate(- 2 *LATTICE_SIZE * dimL + LATTICE_SIZE/2, sqrt(3) * LATTICE_SIZE/2,0);
      }
    } else if ( latticeModeS == 'oblique' ) {//
      translate(-LATTICE_SIZE * dimL- genX * LATTICE_SIZE * dimL, - genY *LATTICE_SIZE * dimL,0);
      for(let i = 0 ; i < 2 * dimL ; i++){
        for(let j= 0 ; j < 2 * dimL ; j++){
          figure(baseFigure);
          translate(LATTICE_SIZE/2, genY * LATTICE_SIZE/2,heightLight);
          lamP(lightSwitch);
          translate(LATTICE_SIZE/2, -genY * LATTICE_SIZE/2,-heightLight);
        }
        translate(- 2 *LATTICE_SIZE * dimL+ genX * LATTICE_SIZE, genY * LATTICE_SIZE,0);
      }
    } 
 }

// the modeling coordinates 
function figure(baseFigure){
  push();
  if (baseFigure == 'column'){
    rotateX(HALF_PI);
    translate(0,150,0);
    cylinder(6, 300);
  } else if (baseFigure == 'box') {
    translate(0,0,15);
    box(30);
  } else if (baseFigure == 'ball') {
    translate(0,0,10);
    sphere(10);
  }  
  pop();
}

function lamP (lightSwitch){
  push();
    if (lightSwitch == 'on') {
      ambientLight(255, 255, 255); // light
      ambientMaterial(160); // white material
      ellipse(0,0,30);
  } else {
    ;
  }
  pop();
}

function resetBackground () {
  background(BACK_COLOR) ;
  //i = 0 ;
}
