import initGLFromCanvas from './initGL'
import createBuffer from './createBuffer'
import Kernel from './compileProgram'
import alloc from './alloc'

export default class {
  constructor(sz) {
    let gl = initGLFromCanvas(document.createElement('canvas'));
    this.programs = {};
    this.texture = alloc(sz, Int32Array);
    this.gl = gl;
  }

  addProgram(name, source) {
    this.programs[name] = new Kernel(this.gl, source, this.texture);
  }

  run (name) {
    let gl = this.gl;
    let kernel = this.programs[name];
    gl.useProgram(kernel.program);
    gl.bindVertexArray(kernel.vao);
    kernel.use(gl);

    //gl.bindBuffer(gl.UNIFORM_BUFFER, kernel.buffers.indexBuffer);
    gl.bindBuffer(gl.UNIFORM_BUFFER, kernel.buffers.positionBuffer);
    gl.bindBuffer(gl.UNIFORM_BUFFER, kernel.buffers.textureBuffer);


    //gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    //gl.readPixels(0, 0, size, size, gl.RGBA_INTEGER, gl.INT, this.texture.data);
    gl.readPixels(0, 0, kernel.size, kernel.size, gl.RGBA_INTEGER, gl.INT, this.texture.data);
    //gl.readPixels(0, 0, size, size, gl.RGBA, gl.FLOAT, this.texture.data);
    gl.bindVertexArray(null);
    return this.texture.data.subarray(0, this.texture.length);
  }
}
