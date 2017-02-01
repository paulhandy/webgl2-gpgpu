import createShader from './createShader'
import createProgram from './createProgram'
import createBuffer from './createBuffer'
import vertexShaderCode from './vertexShader'
import stdlib from './stdlib'

export default (gl, code, ipt) => {
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
  gl.bindVertexArray(null);
  return {program, vao, buffers};
}
