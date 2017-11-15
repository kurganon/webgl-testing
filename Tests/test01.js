var WIDTH = 640,
HEIGHT = 360;

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);

var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
	VIEW_ANGLE,
	ASPECT,
	NEAR,
	FAR);
scene.add(camera);

var radius = 5,
segments = 6,
rings = 6;

var sphereMaterial =
new THREE.MeshLambertMaterial({
color: 0xD43001});

var ball = new THREE.Mesh(
new Three.SphereGeometry(
	radius,
	segments,
	rings),
	sphereMaterial);

scene.add(ball);

pointLight = new THREE.PointLight(0xF8D898);

pointLight.position.x = -1000;
pointLight.position.y = 0;
pointLight.position.z = 1000;
pointLight.intensity = 2.9;
pointLight.distance = 10000;
scene.add(pointLight);

var planeMaterial =
new THREE.MeshLambertMaterial({
color: 0x4BD121});

var plane = new THREE.Mesh(
	new THREE.PlaneGeometry(
		planeWidth * 0.95,
		planeHeight,
		planeQuality,
		planeQuality),
	planeMaterial);

scene.add(plane);

function setup()
{

  draw();
}


function draw()
{
	renderer.render(scene, camera);
	requestAnimationFrame(draw);
}
