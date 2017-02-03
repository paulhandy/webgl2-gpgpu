//import GL2C from './gl2compute'

//import GL from './glutil'
import turbo from './glaccess'

var readAt = `
`;

if(turbo) {
  var blah = turbo.alloc(1e6);
  console.log("test 2");
  blah.data[0] = 0xF3FFFFFF;//Math.pow(2,6) - i; 
  //for (var i = 0; i <= blah.data.length; i++) blah.data[i] = 0xFFFFFFFF;//Math.pow(2,6) - i; 
  console.log(blah.data.slice(0,10)); 
  turbo.run(blah, 
  `void main(void) { 
    vec2 size = vec2(textureSize(u_texture, 0) - 1);
    vec2 texcoord = pos * size;
    ivec2 coord = ivec2(texcoord);
    vec4 tex = texelFetch(u_texture, coord, 0);
    ivec4 i = ivec4(tex);
    i &= 0xF;
    //commit(read() * 4.);
    //color = vec4(i + (coord.x + coord.y));//tex * 9.;
    color = tex + texelFetch(u_texture, ivec2(0,0),0);
  }`);
  console.log(blah.data.slice(0,10)); 
}
/*
var sources = [
  { name: "test",
    fs: `
    void main(void) { 
      commit(read() * 4);
    }
    `
  }
];
new GL2C(sources);
*/
/*
if(turbo) {
  var blah = turbo.alloc(1e6);
  console.log("test 2");
  for (var i = 0; i <= blah.data.length; i++) blah.data[i] = Math.pow(2,6) - i; 
  console.log(blah.data.slice(0,10)); 
  turbo.run(blah, 
  `void main(void) { 
    commit(read() * 4.);
  }`);
  console.log(blah.data.slice(0,10)); 
}
*/
/*
var turbojs = new GL(1e6);
console.log("is turbojs?");
if(turbojs) {
  turbojs.addProgram("test", `void main(void) { 
    ivec4 t = texture(u_texture, pos);
//myOutputColor = ivec4(1,3,4,2);
//myOutputColor = t;
    myOutputColor = t;
//ivec4(gl_FragCoord.xy, int(t.r), int(t.g)); 
  }`);
  console.log("hi");
  for (var i = 0; i <= turbojs.texture.data.length; i++) turbojs.texture.data[i] = i; 
  console.log(turbojs.texture.data.slice(0,10)); 
  turbojs.run("test");
  console.log(turbojs.texture.data.slice(0,10)); 
}
*/
