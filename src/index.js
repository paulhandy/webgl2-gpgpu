import GL from './glutil'

var turbojs = new GL(1e6);
console.log("is turbojs?");
if(turbojs) {
  turbojs.addProgram("test", `void main(void) { 
    ivec4 t = texture(u_texture, pos);
    //myOutputColor = ivec4(1,3,4,2);//t;
    myOutputColor = t;
    //myOutputColor = ivec4(pos.xy * 100., t.ba);
    //ivec4(gl_FragCoord.xy, int(t.r), int(t.g)); 
  }`);
  for (var i = 0; i <= turbojs.texture.data.length; i++) turbojs.texture.data[i] = i; 
  console.log(turbojs.texture.data.slice(0,10)); 
  turbojs.run("test");
  console.log(turbojs.texture.data.slice(0,10)); 
}
