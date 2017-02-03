export 
let vertexShaderCode =
  `#version 300 es
  in vec2 position;
in vec2 texture;
out vec2 pos;

void main(void) {
  pos = texture;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,

  stdlib =
  `#version 300 es
precision highp float;
precision highp int;
precision highp isampler2D;
uniform isampler2D u_texture;
in vec2 pos;
out ivec4 color;

ivec4 read(void) {
  return texture(u_texture, pos);
}

void commit(ivec4 val) {
  color = val;
}

// user code begins here
`
