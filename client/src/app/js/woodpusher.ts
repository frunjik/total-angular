"use strict";

import { createProgram, createShader } from './wgl';

// let rect;
const m = 3;
const s = 60;
const x = 0, y = 0, w = s, h = s;
const colorRed = {
    r: 1,
    g: 0,
    b: 0,
    a: 1,
};
const colorGreen = {
    r: 0,
    g: 1,
    b: 0,
    a: 1,
};
const colorYellow = {
    r: 1,
    g: 1,
    b: 0,
    a: 1,
};
const colorBlue = {
    r: 0,
    g: 0,
    b: 1,
    a: 1,
};

const greenBlock = {
    w: 1,
    h: 2,
    c: colorGreen
};
const redBlock = {
    w: 2,
    h: 2,
    c: colorRed
};
const blueBlock = {
    w: 1,
    h: 1,
    c: colorBlue
};
const yellowBlock = {
    w: 2,
    h: 1,
    c: colorYellow
};

const blocks = [
    {
        x: 0,
        y: 0,
        b: greenBlock
    },
    {
        x: 1,
        y: 0,
        b: redBlock
    },
    {
        x: 3,
        y: 0,
        b: greenBlock
    },

    {
        x: 0,
        y: 2,
        b: greenBlock
    },
    {
        x: 1,
        y: 2,
        b: yellowBlock
    },
    {
        x: 3,
        y: 2,
        b: greenBlock
    },
    {
        x: 0,
        y: 4,
        b: blueBlock
    },
    {
        x: 1,
        y: 3,
        b: blueBlock
    },
    {
        x: 2,
        y: 3,
        b: blueBlock
    },
    {
        x: 3,
        y: 4,
        b: blueBlock
    },
];

export const woodpusher = {
    rect: null,
    render: function(gl) {
        if (!woodpusher.rect) {
            woodpusher.rect = createColoredRectangle(gl);
        }
        blocks.forEach(b => {
            renderColoredRectangle(gl, woodpusher.rect, b.x * w + (m/2), b.y * h + (m/2), b.b.w * w - m, b.b.h * h - m, b.b.c);
        });
    }
};

function createColoredRectangle(gl) {
    const vertexShaderSource = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    void main() {
    // convert the rectangle from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);;
    }
    `;

    const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
    `;

    const result = {
        vss: createShader(gl, gl.VERTEX_SHADER, vertexShaderSource),
        fss: createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource),
        program: null,
        positionAttributeLocation: null,
        positionBuffer: null,
        positionBufferLayout: null,
        resolutionUniformLocation: null,
        colorUniformLocation: null,
    };
    result.program = createProgram(gl, result.vss, result.fss);

    // look up where the vertex data needs to go.
    result.positionAttributeLocation = gl.getAttribLocation(result.program, "a_position");
    // look up uniform locations
    result.resolutionUniformLocation = gl.getUniformLocation(result.program, "u_resolution");
    result.colorUniformLocation = gl.getUniformLocation(result.program, "u_color");
    // Create a buffer to put three 2d clip space points in
    result.positionBuffer = gl.createBuffer();
    result.positionBufferLayout = {
        size: 2,          // 2 components per iteration
        type: gl.FLOAT,   // the data is 32bit floats
        normalize: false, // don't normalize the data
        stride: 0,        // 0 = move forward size * sizeof(type) each iteration to get the next position
        offset: 0,        // start at the beginning of the buffer
        count:  6,        // 6 vertices (faVertices.length / size)
    };
    return result;
}

function renderColoredRectangle(gl, r, x, y, w, h, c) {
  // Tell it to use our program (pair of shaders)
  gl.useProgram(r.program);

  // Turn on the attribute
  gl.enableVertexAttribArray(r.positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, r.positionBuffer);

  const pbl = r.positionBufferLayout;
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
    r.positionAttributeLocation, 
    pbl.size, 
    pbl.type, 
    pbl.normalize, 
    pbl.stride, 
    pbl.offset
  );

  // set the resolution
  gl.uniform2f(r.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // set the rectangle
  var x1 = x;
  var x2 = x + w;
  var y1 = y;
  var y2 = y + h;

  const faVertices = new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, faVertices, gl.STATIC_DRAW);

  // Set color.
  gl.uniform4f(r.colorUniformLocation, c.r, c.g, c.b, c.a);

  // Draw
  gl.drawArrays(gl.TRIANGLES, pbl.offset, pbl.count);
}

