export default (canvas) => {
  let attr = {alpha : false, antialias : false};
  let gl = canvas.getContext("webgl2", attr) || 
    canvas.getContext("experimental-webgl2", attr) ||
    null;
  if (!gl)
    throw new Error("turbojs: Unable to initialize WebGL. Your browser may not support it.");
  return gl;
}

    // turbo.js requires a 32bit float vec4 texture. Some systems only provide 8bit/float
    // textures. A workaround is being created, but turbo.js shouldn't be used on those
    // systems anyway.
    /*
    if (!gl.getExtension('OES_texture_float'))
      throw new Error('turbojs: Required texture format OES_texture_float not supported.');
      */
