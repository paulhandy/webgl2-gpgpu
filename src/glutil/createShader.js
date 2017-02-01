export default (gl, type, source) => {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(source);
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
/*
    // Use this output to debug the shader
    // Keep in mind that WebGL GLSL is **much** stricter than e.g. OpenGL GLSL
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      var LOC = code.split('\n');
      var dbgMsg = "ERROR: Could not build shader (fatal).\n\n------------------ KERNEL CODE DUMP ------------------\n"

      for (var nl = 0; nl < LOC.length; nl++)
        dbgMsg += (stdlib.split('\n').length + nl) + "> " + LOC[nl] + "\n";

      dbgMsg += "\n--------------------- ERROR  LOG ---------------------\n" + gl.getShaderInfoLog(fragmentShader)

      throw new Error(dbgMsg);
    }
    */
