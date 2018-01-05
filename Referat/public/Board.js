"use strict";

function sprite() {
	this.posx = 0;		//Aktuelle Position
	this.posy = 0;
	this.ox = 15;	//Originverschiebung
	this.oy = 15;
	this.tri = 0;	//Anzahl Dreiecke
	
	this.sizex = 0;	//Maße für Collisiondetection
	this.sizey = 0;
	
	this.richtung = 0;	//In welche Richtung die Action geht
	this.vis = true;	//sichtbar
	this.friendly = true;	//Spielerrakete oder Invaderrakete
	this.gup = false;	//bewegt es sich rauf?
	this.gdown = false;	//bewegt es sich runter?
	this.gleft = false;	//bewegt es sich nach links?
	this.gright = false;	//bewegt es sich nach rechts?
	this.gfire = false;	//wird geschossen?
	this.listen = false;	//ist der EventListener an?
	
	this.color = [];	//Farbe
	this.form = [];		//Form

		//Konstruktor:
	this.init = function(posxi, posyi, oyi, trii, sizexi, sizeyi, richtungi, friendlyi, gupi, gdowni, glefti, grighti, colori, formi){
		this.posx = posxi;
		this.posy = posyi;
		this.oy = oyi;
		this.tri = trii;
		this.sizex = sizexi;
		this.sizey = sizeyi;
		this.richtung = richtungi;
		this.friendly = friendlyi;
		this.gup = gupi;
		this.gdown = gdowni;
		this.gleft = glefti;
		this.gright = grighti;
		this.color = colori;
		this.form = formi;
	};	//initialisierung
	
	this.update = function(posxi, posyi, visi, formi){
		this.posx = posxi;
		this.posy = posyi;
		this.vis = visi;
		this.form = formi;
	}

	this.shooting = function(){
	//---------------------
		if(this.gfire){
			socket.emit('fire', [id, this.gfire]);
			this.gfire = false;
		}
	//---------------------
	};	//missile abschuss
	
	this.move = function(){
		if(id == 0 || id == 1){
			if(this.listen == false){
				this.events();
			}
		//---------------------
			if(this.gup || this.gdown){
				socket.emit('boolean', [id, this.gup, this.gdown]);
			}
		//---------------------
		}
	};
	
	this.events = function(){
		document.addEventListener('keydown', (event) => {
			const keyName = event.key;
			if(keyName === 's' || keyName === 'S'){
				this.gdown = true;
			}
			if(keyName === 'w' || keyName === 'W'){
				this.gup = true;
			}
			if(keyName === ' '){
				//Kein Ereignis
			}
		}, false);

		document.addEventListener('keyup', (event) => {
			const keyName = event.key;
			if(keyName === 's' || keyName === 'S'){
				this.gdown = false;
			}
			if(keyName === 'w' || keyName === 'W'){
				this.gup = false;
			}
			if(keyName === ' '){
				this.gfire = true;
			}
		}, false);
	};
}

//---------------------------

var fps = 7;
var sprites = [];
var socket = io();
var id = -1;
var init = false;


var canvas;
var gl;
var program;
var positionLocation;
var resolutionLocation;
var colorLocation;
var matrixLocation;
var positionBuffer;

//---------------------------

socket.on('broadcast', function(data){
	if(init){
		for(var j = 0; j < data.length || j < sprites.length; j++){
			sprites[j].update(data[j][0], data[j][1], data[j][2], data[j][3]);
		}
		document.getElementById('error-container').innerHTML = id;
	}
	
});

socket.on('message', function(data){
	id = data.iden;
	for(var j = 0; j < data.sprites.length; j++){
		sprites.push(new sprite());
		sprites[sprites.length - 1].init(data.sprites[j].posx, data.sprites[j].posy, data.sprites[j].oy, data.sprites[j].tri, data.sprites[j].sizex, data.sprites[j].sizey, data.sprites[j].richtung, data.sprites[j].friendly, data.sprites[j].gup, data.sprites[j].gdown, data.sprites[j].gleft, data.sprites[j].gright, data.sprites[j].color, data.sprites[j].form);
	
	}
	main();
	init = true;
});

//---------------------------

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}

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
	
	var ingame = setInterval(update, (1000/fps));
	//clearInterval(ingame);
}

function update(){
	gl.clear(gl.COLOR_BUFFER_BIT);

	for(var i = 0; i < sprites.length; i++){
		if(sprites[i].vis){
			draw(gl, sprites[i]);
		}
		
		sprites[i].move();
	}
}

function draw(gl, spritec){
	setGeometry(gl, spritec.form);
	
	var translation = [spritec.posx, spritec.posy];
	var scale = [1, 1];
		if(spritec.richtung == -1){
			scale = [-1, 1];
		}
	
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
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	// set the resolution
	gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

	// set the color
	gl.uniform4fv(colorLocation, spritec.color);

	// Compute the matrices
	var projectionMatrix = m3.projection(
		gl.canvas.clientWidth, gl.canvas.clientHeight);
	var translationMatrix = m3.translation(translation[0], translation[1]);
	var rotationMatrix = m3.rotation(0);
	var scaleMatrix = m3.scaling(scale[0], scale[1]);

	// make a matrix that will move the origin of the 'F' to its center.
	var moveOriginMatrix = m3.translation((-1 * spritec.ox), (-1 * spritec.oy));

	// Multiply the matrices.
	 var matrix = m3.multiply(projectionMatrix, translationMatrix);
	matrix = m3.multiply(matrix, rotationMatrix);
	matrix = m3.multiply(matrix, scaleMatrix);
	matrix = m3.multiply(matrix, moveOriginMatrix);

	// Set the matrix.
	gl.uniformMatrix3fv(matrixLocation, false, matrix);

	// Draw the geometry.
	var primitiveType = gl.TRIANGLES;
	gl.drawArrays(primitiveType, 0, (spritec.tri * 3));
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
