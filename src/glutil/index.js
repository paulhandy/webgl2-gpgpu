import initGLFromCanvas from './initGL'
import createTexture from './createTexture'
import createBuffer from './createBuffer'
import compile from './compileProgram'
import alloc from './alloc'

export default class {
  constructor(sz) {
    let gl = initGLFromCanvas(document.createElement('canvas'));
    this.programs = {};
    this.texture = alloc(sz, Int32Array);
    this.gl = gl;
  }

  addProgram(name, source) {
    this.programs[name] = compile(this.gl, source, this.texture);
  }

  run (name) {
    let gl = this.gl;
    let {program, vao} = this.programs[name];
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    let uTexture = gl.getUniformLocation(program, 'u_texture');
    var size = Math.sqrt(this.texture.data.length) / 4;
    var texture = createTexture(gl, this.texture.data, size);

    gl.viewport(0, 0, size, size);
    gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());

    // Types arrays speed this up tremendously.
    let nTexture = createTexture(gl, new Int32Array(this.texture.data.length), size);
    //var nTexture = createTexture(gl, new Int32Array(this.texture.data.length), size);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, nTexture, 0);
    //gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, nTexture, 0, 0);

    // Test for mobile bug MDN->WebGL_best_practices, bullet 7
    var frameBufferStatus = (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE);

    if (!frameBufferStatus)
      throw new Error('turbojs: Error attaching float texture to framebuffer. Your device is probably incompatible. Error info: ' + frameBufferStatus.message);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(uTexture, 0);

    //gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    //gl.readPixels(0, 0, size, size, gl.RGBA_INTEGER, gl.INT, this.texture.data);
    gl.readPixels(0, 0, size, size, gl.RGBA_INTEGER, gl.INT, this.texture.data);
    //gl.readPixels(0, 0, size, size, gl.RGBA, gl.FLOAT, this.texture.data);
    gl.bindVertexArray(null);
    return this.texture.data.subarray(0, this.texture.length);
  }
}
