//alloc(sz)
export default (sz, f) => {
  // A sane limit for most GPUs out there.
  // JS falls apart before GLSL limits could ever be reached.
  if (sz > 16777216)
    throw new Error("turbojs: Whoops, the maximum array size is exceeded!");

  var ns = Math.pow(Math.pow(2, Math.ceil(Math.log(sz) / 1.386) - 1), 2);
  return {
    data : new (f || Float32Array)(ns * 16),
    length : sz
  };
}

