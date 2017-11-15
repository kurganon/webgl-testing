  "use strict";

function main() {
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
	var translationLocation = gl.getUniformLocation(program, "u_translation");
	var scaleLocation = gl.getUniformLocation(program, "u_scale");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Put geometry data into buffer
	setGeometry(gl);

  var translation = [100, 150];
	var scale = [1, 1];
  var color;

  drawScene();

  // Setup a ui.
  webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});
  webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), 
		min: -5, max: 5, step: 0.01, precision: 2});
  webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), 
		min: -5, max: 5, step: 0.01, precision: 2});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    }
  }

	function updateScale(index){
		return function(event, ui){
			scale[index] = ui.value;
			drawScene();
		}
	}

  // Draw a the scene.
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

/*    // Setup a rectangle
    setRectangle(gl, translation[0], translation[1], width, height); */

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

	//set the translation
	gl.uniform2fv(translationLocation, translation);

	//set the scale
	gl.uniform2fv(scaleLocation, scale);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 18; //6 triangles in the 'F', 3 points per triangle
    gl.drawArrays(primitiveType, offset, count);
  }
}

function setColor(){
	return [Math.random(), Math.random(), Math.random(), 1];
}

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

//Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl){
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			//left column
			0, 0,
			30, 0,
			0, 150,
			0, 150,
			30, 0,
			30, 150,

			//top rung
			30, 0,
			100, 0,
			30, 30,
			30, 30,
			100, 0,
			100, 30,

			//middle rung
			30, 60,
			67, 60,
			30, 90,
			30, 90,
			67, 60,
			67, 90,
		]),
		gl.STATIC_DRAW
	);
}

main();
