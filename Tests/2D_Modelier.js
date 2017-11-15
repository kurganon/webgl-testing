"use strict";

/*document.addEventListener('keydown', (event) => {
	console.log(event.key);
}, false);

document.addEventListener('keyup', (event) => {
	console.log(event.code);
}, false); */



function main() {
	var xd = 0, yd = 0, ad = 0, sxd = 0, syd = 0;
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer
  //setGeometry(gl);
	//var t = 6;
	drawDefender(gl);
	var t = 2;
	var oh = 15;
	var ow = 15;

  var translation = [100, 150];
	var angleInDegrees = 360;
  var angleInRadians = 0;
	var scaleLimit = 5;
  var scale = [1, 1];
  var color = [Math.random(), Math.random(), Math.random(), 1];

  drawScene();

	document.addEventListener('keydown', (event) => {
		const keyName = event.key;
		if(keyName === 'd' || keyName === 'D'){
			xd = 2;
		}
		if(keyName === 'a' || keyName === 'A'){
			xd = -2;
		}
		if(keyName === 's' || keyName === 'S'){
			yd = 2;
		}
		if(keyName === 'w' || keyName === 'W'){
			yd = -2;
		}
		if(keyName === 'q' || keyName === 'Q'){
			ad = -2;
		}
		if(keyName === 'e' || keyName === 'E'){
			ad = 2;
		}
		
		if(keyName === 'ArrowRight'){
			sxd = 0.02;
		}
		if(keyName === 'ArrowLeft'){
			sxd = -0.02;
		}
		if(keyName === 'ArrowDown'){
			syd = -0.02;
		}
		if(keyName === 'ArrowUp'){
			syd = 0.02;
		}
		if(keyName === ' '){
			syd = Math.random() / 10 * vorzeichen();
			sxd = Math.random() / 10 * vorzeichen();
			xd = Math.random() * 30 * vorzeichen();
			yd = Math.random() * 30 * vorzeichen();
			ad = Math.random() * 30 * vorzeichen();
		}
		updateAll();
	}, false);

	document.addEventListener('keyup', (event) => {
		const keyName = event.key;
		if(keyName === 'd' || keyName === 'D' || keyName === 'a' || keyName === 'A'){
			xd = 0;
		}
		if(keyName === 's' || keyName === 'S' || keyName === 'w' || keyName === 'W'){
			yd = 0;
		}
		if(keyName === 'q' || keyName === 'Q' || keyName === 'e' || keyName === 'E'){
			ad = 0;
		}
		if(keyName === 'ArrowRight' || keyName === 'ArrowLeft'){
			sxd = 0;
		}
		if(keyName === 'ArrowDown' || keyName === 'ArrowUp'){
			syd = 0;
		}
		if(keyName === ' '){
			syd = 0;
			sxd = 0;
			xd = 0;
			yd = 0;
			ad = 0;
		}
	}, false);
	
	function updateAll(){
		translation[0] += xd;
		if(translation[0] >= gl.canvas.clientWidth){
			translation[0] = gl.canvas.clientWidth;
		} else if(translation[0] <= 0){
			translation[0] = 0;
		}

		translation[1] += yd;
		if(translation[1] >= gl.canvas.clientHeight){
			translation[1] = gl.canvas.clientHeight;
		} else if(translation[1] <= 0){
			translation[1] = 0;
		}
		
		if(angleInDegrees - ad >= 360){
			angleInDegrees = angleInDegrees - ad - 360;
		} else if(angleInDegrees - ad <= 0){
			angleInDegrees = angleInDegrees + 360 - ad;
		} else {
			angleInDegrees -= ad;
		}
		angleInRadians = angleInDegrees * Math.PI / 180;
		
		scale[0] += sxd;
		if(scale[0] >= scaleLimit){
			scale[0] = scaleLimit;
		} else if(scale[0] <= -scaleLimit){
			scale[0] = -scaleLimit;
		}

		scale[1] += syd;
		if(scale[1] >= scaleLimit){
			scale[1] = scaleLimit;
		} else if(scale[1] <= -scaleLimit){
			scale[1] = -scaleLimit;
		}
		
		drawScene();
	}
	
	function vorzeichen(){
		var v = Math.random();
		if(v < 0.5){
			return -1;
		} else {
			return 1;
		}
	}

  // Draw the scene.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

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
	color = setColor();
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
}

function setColor(){
	return [Math.random(), Math.random(), Math.random(), 1];
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

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2,
      ]),
      gl.STATIC_DRAW);
}

function setGeometry(gl, x, y) {
	var width = 100;
	var height = 150;
	var thickness = 30;
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			//left column
			x, y,
			x + thickness, y,
			x, y + height,
			x, y + height,
			x + thickness, y,
			x + thickness, y + height,
			
			// top rung
			x + thickness, y,
			x + width, y,
			x + thickness, y + thickness,
			x + thickness, y + thickness,
			x + width, y,
			x + width, y + thickness,
			
			//middle rung
			x + thickness, y + thickness * 2,
			x + width * 2 / 3, y + thickness * 2,
			x + thickness, y + thickness * 3,
			x + thickness, y + thickness * 3,
			x + width * 2 / 3, y + thickness * 2,
			x + width * 2 / 3, y + thickness * 3,
		]),
		gl.STATIC_DRAW
	);
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,

          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,

          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
      ]),
      gl.STATIC_DRAW);
}

function drawDefender(gl){
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			0, 0,
			10, 15,
			30, 15,

			0, 30,
			10, 15,
			30, 15,
		]),
		gl.STATIC_DRAW
	);
}

main();
