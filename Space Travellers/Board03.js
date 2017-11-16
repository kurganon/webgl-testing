"use strict";

var player = [];
var ammo = [];
var traveller = [];
var canvasX;
var canvasY;
var ingame;
var gameon = false;
var score1 = 0;
var score2 = 0;

var canvas;
var gl;
var date;
var fps;
var duration;
var delay;
var program;
var positionLocation;
var resolutionLocation;
var colorLocation;
var matrixLocation;
var positionBuffer;

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}
	
	date = new Date();
	fps = 30;
	duration = 1000 / fps;
	delay = duration;
	
	canvasX = gl.canvas.clientWidth;
	canvasY = gl.canvas.clientHeight;
	gameInit();

	// setup GLSL program
	program = webglUtils.createProgramFromScripts(gl, 
		["2d-vertex-shader", "2d-fragment-shader"]);

  	// look up where the vertex data needs to go.
	positionLocation = gl.getAttribLocation(program, "a_position");

  	// lookup uniforms
  	resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  	colorLocation = gl.getUniformLocation(program, "u_color");
  	matrixLocation = gl.getUniformLocation(program, "u_matrix");

  	// Create a buffer to put positions in
  	positionBuffer = gl.createBuffer();
  	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	ingame = setInterval(update, delay);
	//clearInterval(ingame);
}

function update(){
	var temp1 = date.getTime();
	
	// Clear the canvas.
	gl.clear(gl.COLOR_BUFFER_BIT);
	for(var i = 0; i < player.length || i < traveller.length 
		|| i < ammo.length; i++){

		if(i < player.length){
			player[i].update();
			drawDetails(gl, player[i]);
		}

		if(i < ammo.length){
			if(ammo[i].vis == true){
				collide(ammo[i]);
			}
			while(ammo[i] != null && i < ammo.length 
				&& ammo[i].vis == false){	
				//entfernen unsichtbarer elemente
				ammo.splice(i, 1);
			}
			if(ammo[i] != null && i < ammo.length){
				ammo[i].update();
				drawDetails(gl, ammo[i]);
			}
		}

		if(i < traveller.length){
			while(traveller[i] != null && i < traveller.length
				&& traveller[i].vis == false){	
				//entfernen unsichtbarer elemente
				traveller.splice(i, 1);
			}
			if(traveller[i] != null && i < traveller.length){
				traveller[i].update();
				drawDetails(gl, traveller[i]);
			}
		}
		if(traveller.length == 0){
			clearInterval(ingame);
			gewonnen();
		}
	}
	scoring();
	var temp2 = date.getTime()
	if(temp2 < temp1 + duration){
		delay = temp1 + duration - temp2;
	}
}

function drawDetails(gl, sprite){
	setGeometry(gl, sprite.getForm());
	var t = sprite.tri;
	var oh = sprite.oy;
	var ow = sprite.ox;
	
	var translation = [sprite.posx, sprite.posy];

	var angleInRadians = 0;
	var scale = [1, 1];
		if(sprite.richtung == -1){
			scale = [-1, 1];
		}
	var color;

	if(gl.canvas.width !== gl.canvas.clientWidth || 
		gl.canvas.height !== gl.canvas.clientHeight){
		gl.canvas.width = gl.canvas.clientWidth;
		gl.canvas.height = gl.canvas.clientHeight;
	}

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Turn on the attribute
	gl.enableVertexAttribArray(positionLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(
	positionLocation, size, type, normalize, stride, offset)

	// set the resolution
	gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

	// set the color
	color = setColor(sprite);
	gl.uniform4fv(colorLocation, color);

	// Compute the matrices
	var projectionMatrix = m3.projection(
		gl.canvas.clientWidth, gl.canvas.clientHeight);
	var translationMatrix = m3.translation(translation[0], translation[1]);
	var rotationMatrix = m3.rotation(angleInRadians);
	var scaleMatrix = m3.scaling(scale[0], scale[1]);

	// make a matrix that will move the origin of the 'F' to its center.
	var moveOriginMatrix = m3.translation(-ow, -oh);

	// Multiply the matrices.
	 var matrix = m3.multiply(projectionMatrix, translationMatrix);
	matrix = m3.multiply(matrix, rotationMatrix);
	matrix = m3.multiply(matrix, scaleMatrix);
	matrix = m3.multiply(matrix, moveOriginMatrix);

	// Set the matrix.
	gl.uniformMatrix3fv(matrixLocation, false, matrix);

	// Draw the geometry.
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = t * 3;  // 6 triangles in the 'F', 3 points per triangle
	gl.drawArrays(primitiveType, offset, count);
}

function shot(posx, posy, dir, friend){
	ammo.push(new missile);
	ammo[ammo.length - 1].init(posx, posy, true, canvasX, canvasY, dir, friend);
}

function gameInit(){
	playerInit();
	travelInit();
	ammoInit();
	gameon = true;
}

function playerInit(){
	if(player.length == 0){
		var def = new defender();
		var def2 = new defender();

		player.push(def);
		player.push(def2);
	}
	player[0].init(30, 20, true, canvasX, canvasY, 1);
	player[0].gfire = false;
	player[1].init((canvasX - 30), 20, true, canvasX, canvasY, -1);
	player[1].gfire = false;
}

function travelInit(){
	var breite = 30; //Hardcode Breite der Invader
	var hoehe = breite; //Hardcode Höhe der Invader
	var midx = breite/2;	//Hardcode der X Originverschiebung
	var rand = breite * 2;
	var abstand = 6;
	var col = (canvasX - 2*rand)/(breite + abstand); 
	var row = canvasY/(hoehe + abstand);
	if(traveller.length != 0){
		while(traveller.length > 0){
			traveller.pop();
		}
	}
	for(var i = 0; i < row + 1; i++){
		for(var j = 1; j < col - 1; j++){
			traveller.push(new invader());
			var x = rand + midx + (j*breite) + (abstand * j);
			var y = 0 - (i*hoehe) - (abstand * i);
			var bl = x - (breite * 1.75);
			var br = x + (breite * 1.4);
			traveller[traveller.length - 1].init(x, y, true, bl, br, canvasY);
		}
	}
}

function ammoInit(){
	if(ammo.length != 0){
		while(ammo.length > 0){
			ammo.pop();
		}
	}
}

function setColor(sprite){
	return sprite.color;
}

function collide(rocket){
	var o = rocket.posy - rocket.oy, r = rocket.posx + rocket.ox, 
		l = rocket.posx - rocket.ox, u = rocket.posy + rocket.oy;
	switch(rocket.friendly){
		case true:
		for(var i = 0; i < traveller.length; i++){
			if(traveller[i].vis == false){
				continue;
			}
			var tempo = traveller[i].posy - traveller[i].oy;
			var tempu = traveller[i].posy + traveller[i].oy;
			var templ = traveller[i].posx - traveller[i].ox;
			var tempr = traveller[i].posx + traveller[i].ox;
			if((tempo < o && tempu > o) || (tempo < u && tempu > u)){
				if((templ < l && tempr > l) || (templ < r && tempr > r)){
					rocket.vis = false;
					traveller[i].vis = false;
					switch(rocket.richtung){
						case 1:
							score1 += 200;
							break;
						case -1:
							score2 += 200;
							break;
						default:
							break;
					}
					return;
				}
			}
		}
		case false:
	}
}

function scoring(){
	document.getElementById("indscore").innerHTML = score1 + " - " + score2;
	document.getElementById("scores").innerHTML = (score1 + score2);
}

function gewonnen(){
	var ret = false;
	gameon = false;
	document.getElementById("winnerBoard").innerHTML = "Everyone is dead!";
	document.getElementById("instruction").innerHTML = "Enter - again";
	document.addEventListener('keyup', (event) => {
				const keyName = event.key;
				if(keyName === 'Enter'){
					ret = true;
				}
				entered(ret);
		}, false);
	if(ret){
		retry();
	}
}

function entered(ret){
	if(gameon){
		return;
	}
	if(!gameon){
		if(ret){
			retry();
		}
	}
}

function retry(){
	gameInit();
	score1 = 0;
	score2 = 0;
	scoring();
	
	document.getElementById("winnerBoard").innerHTML = "Space Traveller";
	document.getElementById("instruction").innerHTML =
	"W - move up<br>S - move down<br>Arrow Up - move up<br>Arrow Down - move down<br>Space - shoot";
	
	ingame = setInterval(update, delay);
}

var m3 = {
	projection: function(width, height){
		//Note: This matrix flips the Y axis so that 0 is at the top
		return [
			2 / width, 0, 0,
			0, -2 / height, 0,
			-1, 1, 1,
		];
	},
	
  identity: function() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  },

  translation: function(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },

  rotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },

  scaling: function(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};

function setGeometry(gl, gArray) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(gArray),
      gl.STATIC_DRAW);
}

main();
