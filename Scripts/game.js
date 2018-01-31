var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 1200, fieldHeight = 200;
var truck;
var WIDTH = 640, HEIGHT = 360;

var VIEW_ANGLE = 50,
  ASPECT = WIDTH/HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;
var trafficCars = new Array();
// ball variables
var paddle1;
var counter = 0;
var points = 0, pointsIncrease = 5, counterSpeed = 1;
var speed = 1;

function setup(){
  setupScene();
  setupRoad();
  setupCar();
  setupCamera();
  setupLight();
  setupTraffic();
  draw();
}

function draw(){
  requestAnimationFrame(draw);
  playerPaddleMovement();
  computeTraffic();
  countScore();
  renderer.render(scene, camera)
}



function countScore(){
  counter += counterSpeed;
  if(counter % 30 == 0){
    points += pointsIncrease;
    document.getElementById("scores").innerHTML = "" + points;
  }
  if(points % 100 == 0){
    speed *= 1.01;
  }
}

function setupCar(){
  var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});

    // set up the paddle vars
    paddleWidth = 30;
    paddleHeight = 15;
    paddleDepth = 10;
    paddleQuality = 1;

    paddle1 = new THREE.Mesh(
      new THREE.CubeGeometry(
    	paddleWidth,
    	paddleHeight,
    	paddleDepth,
    	paddleQuality,
    	paddleQuality,
    	paddleQuality),
      paddle1Material);

    scene.add(paddle1);

    var loader = new THREE.ColladaLoader();
    loader.load("Truck_dae.dae", function (result) {
        truck = result.scene.children[0].children[0].clone();
        truck.scale.set(0.8, 0.8, 0.8);
        truck.position.x = truck.position.x - 545;
        truck.position.y = paddle1.position.y;
        truck.rotation.z = 90 * Math.PI/180;
        scene.add(truck);
        paddle1.position.x = paddle1.position.x - 1000;
    });


    paddle1.position.x = -fieldWidth/2 + paddleWidth + 10;

    paddle1.position.z = paddleDepth;
}

function setupTraffic(){
  var trafficMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x00FF00
		});

    // set up the paddle vars
    trafficWidth = 30;
    trafficHeight = 15;
    trafficDepth = 10;
    trafficQuality = 1;

    for(i = 0; i < 20; i++){
      traffic = new THREE.Mesh(
        new THREE.CubeGeometry(
      	trafficWidth,
      	trafficHeight,
      	trafficDepth,
      	trafficQuality,
      	trafficQuality,
      	trafficQuality),
        trafficMaterial);

      scene.add(traffic);

      traffic.position.x = paddle1.position.x + 200 + i * 130;
      traffic.position.y = generateYPostion();
      traffic.position.z = paddleDepth;
      trafficCars.push(traffic)
    }
}

function computeTraffic(){
    for(i = 0; i < trafficCars.length; i++){

      if(trafficCars[i].position.x < truck.position.x + 45 && trafficCars[i].position.x > truck.position.x - 45){
        if(trafficCars[i].position.y + 15 > truck.position.y && trafficCars[i].position.y - 15 < truck.position.y){
          speed = 0;
          pointsIncrease = 0;
          paddleSpeed = 0;
          counterSpeed = 0;
          document.getElementById("scores").innerHTML = "Your Score is: " + points + ".";
          document.getElementById("title").innerHTML = "Refresh to try again.";
        }
      }

      if(trafficCars[i].position.x > truck.position.x - 40){
        trafficCars[i].position.x -= speed;
      } else {
        trafficCars[i].position.x = fieldWidth;
        trafficCars[i].position.y = generateYPostion();
      }
    }
}

function generateYPostion(){
  return Math.floor((Math.random() * fieldHeight * 0.80) - fieldHeight * 0.40);
}

function setupRoad(){

  // set up the playing surface plane
   var planeWidth = fieldWidth,
  planeHeight = fieldHeight,
  planeQuality = 10;

  // create the playing surface plane
  var plane = createMesh(
      new THREE.PlaneGeometry(
      planeWidth * 1.1,	// 95% of table width, since we want to show where the ball goes out-of-bounds
      planeHeight,
      planeQuality,
      planeQuality),
      document.getElementById("termac").src);


  var grass = createMesh(
      new THREE.PlaneGeometry(
      planeWidth,	// 95% of table width, since we want to show where the ball goes out-of-bounds
      planeHeight * 5,
      planeQuality,
      planeQuality),
      document.getElementById("grass").src);

  grass.position.z = plane.position.z - 1;

  scene.add(plane);
  scene.add(grass);
}

function setupCamera(){
  camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  scene.add(camera);

  camera.position.x = paddle1.position.x - 100;
  camera.position.z = paddle1.position.z + 100;
  camera.rotation.z = -90 * Math.PI/180;
  camera.rotation.y = -60 * Math.PI/180;
}

function setupLight(){
  pointLight = new THREE.PointLight(0xF8D898);

  // set its position
  pointLight.position.x = -1000;
  pointLight.position.y = 0;
  pointLight.position.z = 1000;
  pointLight.intensity = 2.9;
  pointLight.distance = 10000;

  // add to the scene
  scene.add(pointLight);

  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(150, 150, 150);
  spotLight.intensity = 2;
  scene.add(spotLight);
}

function setupScene(){
  var c = document.getElementById("gameCanvas");

  renderer = new THREE.WebGLRenderer();


  scene = new THREE.Scene();

  renderer.setSize(WIDTH, HEIGHT);

  c.appendChild(renderer.domElement);
}

function playerPaddleMovement()
{
	// move left
	if (Key.isDown(Key.A))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
		}
	}
	// move right
	else if (Key.isDown(Key.D))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
		}
	}
	// else don't move paddle
	else
	{
		// stop the paddle
		paddle1DirY = 0;
	}

	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
	paddle1.position.y += paddle1DirY;
  truck.position.y += paddle1DirY;
}

function createMesh(geom, imageFile) {
    var texture = THREE.ImageUtils.loadTexture(imageFile)
    var mat = new THREE.MeshPhongMaterial();
    mat.map = texture;

    var mesh = new THREE.Mesh(geom, mat);
    return mesh;
}
