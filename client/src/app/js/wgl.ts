"use strict";

export function render(gl) {
  // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export function renderObject(gl, o) {
  gl.useProgram(o.program);
  gl.enableVertexAttribArray(o.positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, o.positionBuffer);
  const pbl = o.positionBufferLayout;
  gl.vertexAttribPointer(
    o.positionAttributeLocation, 
    pbl.size, 
    pbl.type, 
    pbl.normalize, 
    pbl.stride, 
    pbl.offset
  );
  gl.drawArrays(gl.TRIANGLES, pbl.offset, pbl.count);
}

export function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

export function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
