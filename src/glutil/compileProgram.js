import createShader from './createShader'
import createProgram from './createProgram'
import createBuffer from './createBuffer'
import createTexture from './createTexture'
import vertexShaderCode from './vertexShader'
import stdlib from './stdlib'

export default class {
  constructor (gl, code, ipt) {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, stdlib + code);
    let program = createProgram(gl, vertexShader, fragmentShader);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    let buffers = {
      positionBuffer: createBuffer(gl, [ -1, -1, 1, -1, 1, 1, -1, 1 ]),
      textureBuffer: createBuffer(gl, [  0,  0, 1,  0, 1, 1,  0, 1 ]),
      indexBuffer: createBuffer(gl, [  1,  2, 0,  3, 0, 2 ], Uint16Array, gl.ELEMENT_ARRAY_BUFFER)
    }


    let aPosition = gl.bindAttribLocation(program, 0, 'position');
    let aTexture = gl.bindAttribLocation(program, 1, 'texture');

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureBuffer);
    gl.enableVertexAttribArray(aTexture);
    gl.vertexAttribPointer(aTexture, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);

    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);

    this.program = program;
    this.vao = vao;
    this.buffers = buffers;
    buffers.uTexture = this.init(gl,ipt);
    gl.bindVertexArray(null);


  }

  init (gl, ipt) {
    let uTexture = gl.getUniformLocation(this.program, 'u_texture');
    var size = Math.sqrt(ipt.data.length) / 4;
    var texture = createTexture(gl, ipt.data, size);

    gl.viewport(0, 0, size, size);
    gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());

    // Types arrays speed this up tremendously.
    let nTexture = createTexture(gl, new Int32Array(ipt.data.length), size);
    //var nTexture = createTexture(gl, new Int32Array(ipt.data.length), size);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, nTexture, 0);
    //gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, nTexture, 0, 0);

    // Test for mobile bug MDN->WebGL_best_practices, bullet 7
    var frameBufferStatus = (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE);

    if (!frameBufferStatus)
      throw new Error('turbojs: Error attaching float texture to framebuffer. Your device is probably incompatible. Error info: ' + frameBufferStatus.message);

    this.texture = texture;
    this.size = size;
    return uTexture;
  }

  use (gl) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.buffers.uTexture, 0);
  }
}
