//let stdlib =
export default
`#version 300 es

precision highp float;
precision highp int;
precision highp isampler2D;
uniform isampler2D u_texture;

in vec2 pos;
out ivec4 myOutputColor;

ivec4 read(void) {
  return texture(u_texture, pos);
}

/*
void commit(ivec4 val) {
  myOutputColor = val;
}
*/

// user code begins here
`
