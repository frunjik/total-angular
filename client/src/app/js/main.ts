"use strict";

import { render, renderObject, createProgram, createShader } from './wgl';
import { woodpusher } from './woodpusher';

let drawables = [];

function createRedTriangle(gl) {
    const faTriangles = new Float32Array([
        0, 0,
        0, 0.4,
        0.3, 0,
    ]);
    const vssPos3d = `
        // an attribute will receive data from a buffer
        attribute vec4 a_position;

        // all shaders have a main function
        void main() {

        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = a_position;
        }  
    `;
    const fssRed = `
        // fragment shaders don't have a default precision so we need
        // to pick one. mediump is a good default
        precision mediump float;

        void main() {
        // gl_FragColor is a special variable a fragment shader
        // is responsible for setting
        gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
        }
    `;
    const result = {
        vss: createShader(gl, gl.VERTEX_SHADER, vssPos3d),
        fss: createShader(gl, gl.FRAGMENT_SHADER, fssRed),
        program: null,
        positionAttributeLocation: null,
        positionBuffer: null,
        positionBufferLayout: null,
    };
    result.program = createProgram(gl, result.vss, result.fss);
    result.positionAttributeLocation = gl.getAttribLocation(result.program, "a_position");
    result.positionBuffer = gl.createBuffer();
    result.positionBufferLayout = {
        size: 2,          // 2 components per iteration
        type: gl.FLOAT,   // the data is 32bit floats
        normalize: false, // don't normalize the data
        stride: 0,        // 0 = move forward size * sizeof(type) each iteration to get the next position
        offset: 0,        // start at the beginning of the buffer
        count:  3,        // 3 vertices (faTriangles.length / size)
    };
    gl.bindBuffer(gl.ARRAY_BUFFER, result.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, faTriangles, gl.STATIC_DRAW);
    return result;
}

function init(gl) {
  if (!drawables.length) {
    drawables.push(createRedTriangle(gl));
  }
}

export function start(gl) {
    if (!gl) {
        console.log('start: No webGL');
        return;
    }

    init(gl);
    render(gl);
    woodpusher.render(gl);
    drawables.forEach(o => renderObject(gl, o));
}

export function stop(gl) {
    if (!gl) {
        console.log('stop: No webGL');
        return;
    }

    drawables = [];
    woodpusher.rect = undefined;
}
