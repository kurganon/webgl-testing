"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

	var def = new defender();
	var def2 = new defender();
	var sprites = [];

	sprites.push(def);
	sprites.push(def2);

	sprites[0].init(30, 20, true, gl.canvas.clientWidth, gl.canvas.clientHeight);
	sprites[1].init((gl.canvas.clientWidth - 30), 20, true, gl.canvas.clientWidth, gl.canvas.clientHeight);

  // setup GLSL program
  var program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);

  // look up where the vertex data needs to go.
  var positionLocation = [];

  // lookup uniforms
  var resolutionLocation = [];
  var colorLocation = [];
  var matrixLocation = [];



  // Create a buffer to put positions in
  var positionBuffer = [];

	for(var i = 0; i < sprites.length; i++){
		positionLocation.push(gl.getAttribLocation(program, "a_position"));
		resolutionLocation.push(gl.getUniformLocation(program, "u_resolution"));
  		colorLocation.push(gl.getUniformLocation(program, "u_color"));
  		matrixLocation.push(gl.getUniformLocation(program, "u_matrix"));
		positionBuffer.push(gl.createBuffer());
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[i]);
	}

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  //gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	for(var i = 0; i < sprites.length; i++){
		drawDetails(i, sprites[i]);
	}

	document.addEventListener('keydown', event => {
			for(var i = 0; i < sprites.length; i++){
				drawDetails(i, sprites[i]);
			}
		}, false
	);

	function drawDetails(index, sprite){
		setGeometry(gl, sprite.getForm());
		var t = sprite.tri;
		var oh = sprite.oy;
		var ow = sprite.ox;
		
	  var translation = [sprite.posx, sprite.posy];

	  var angleInRadians = 0;
	  var scale = [1, 1];
	  var color;

		if(gl.canvas.width !== gl.canvas.clientWidth || 
			gl.canvas.height !== gl.canvas.clientHeight){
			gl.canvas.width = gl.canvas.clientWidth;
			gl.canvas.height = gl.canvas.clientHeight;
		}

	    // Tell WebGL how to convert from clip space to pixels
	    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	    // Clear the canvas.
	    gl.clear(gl.COLOR_BUFFER_BIT);

	    // Tell it to use our program (pair of shaders)
	    gl.useProgram(program);

	    // Turn on the attribute
	    gl.enableVertexAttribArray(positionLocation[index]);

	    // Bind the position buffer.
	    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer[index]);

	    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	    var size = 2;          // 2 components per iteration
	    var type = gl.FLOAT;   // the data is 32bit floats
	    var normalize = false; // don't normalize the data
	    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	    var offset = 0;        // start at the beginning of the buffer
	    gl.vertexAttribPointer(
		positionLocation[index], size, type, normalize, stride, offset)

	    // set the resolution
	    gl.uniform2f(resolutionLocation[index], gl.canvas.width, gl.canvas.height);

	    // set the color
		color = setColor(sprite);
	    gl.uniform4fv(colorLocation[index], color);

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
	    gl.uniformMatrix3fv(matrixLocation[index], false, matrix);

	    // Draw the geometry.
	    var primitiveType = gl.TRIANGLES;
	    var offset = 0;
	    var count = t * 3;  // 6 triangles in the 'F', 3 points per triangle
	    gl.drawArrays(primitiveType, offset, count);
	}
}

function setColor(sprite){
	return sprite.color;
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
