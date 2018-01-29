// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 400, fieldHeight = 200;

var dae;


function setup(){
  createScene();

  draw();
}

function createScene(){
  var WIDTH = 640, HEIGHT = 360;

  var VIEW_ANGLE = 50,
    ASPECT = WIDTH/HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

    var c = document.getElementById("gameCanvas");

    renderer = new THREE.WebGLRenderer();

    camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);

    scene = new THREE.Scene();

    scene.add(camera);

    camera.position.z = 320;

    renderer.setSize(WIDTH, HEIGHT);

    c.appendChild(renderer.domElement);

    loader = new THREE.ColladaLoader();
    loader.load('model.dae', loadCollada);

    // // create a point light
    pointLight = new THREE.PointLight(0xF8D898);

    // set its position
    pointLight.position.x = -1000;
    pointLight.position.y = 0;
    pointLight.position.z = 1000;
    pointLight.intensity = 2.9;
    pointLight.distance = 10000;

    // add to the scene
    scene.add(pointLight);

}


function draw(){
  renderer.render(scene, camera)

  requestAnimationFrame(draw);
}

function loadCollada(collada){
  dae = collada.scene;
  scene.add(dae);
}
