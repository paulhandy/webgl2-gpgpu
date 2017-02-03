import turbo from './gl2c'
import searchInit, {transform} from './searchInit'
import {headers, barrierTest, barrier, twist, k_transform} from './kernel'

let HASH_LENGTH = 243,
  STATE_LENGTH = HASH_LENGTH * 3,
  TRANSACTION_LENGTH = HASH_LENGTH * 33;
let MAXIMAGESIZE = 1e6;
let dim = {};
let texelSize = 4;

dim.x = STATE_LENGTH+1;
//dim.x = STATE_LENGTH;
let imageSize= Math.floor(MAXIMAGESIZE / dim.x / texelSize ) * dim.x * texelSize;
dim.y = imageSize / dim.x / texelSize ;

var pack = (l) => (r,k,i) => (i%l ===0 ? r.push([k]): r[r.length-1].push(k)) && r;

export default class {
  constructor() {
    if(turbo) {
      this.buf = turbo.alloc(imageSize);
      this.state = "READY";
      this.findNonce = this._turboFindNonce;
    }
  }

  search(transactionTrits, minWeightMagnitude) {
    return new Promise((res, rej) => {
      if (transactionTrits.length != TRANSACTION_LENGTH) rej(new Error("Incorrect Transaction Length"));
      else if(minWeightMagnitude >= HASH_LENGTH || minWeightMagnitude <= 0) rej(new Error("Incorrect Min-Weight Magnitude"));
      else {
        var states = {
          low : new Int32Array(STATE_LENGTH),
          high : new Int32Array(STATE_LENGTH)
        };
        searchInit(states, transactionTrits);
        this.findNonce(states, minWeightMagnitude, (hash) => res(hash));
      }
    });
  }

  _turboFindNonce(states, minWeightMagnitude, callback) {
    this._turboWriteBuffers(states);
    console.log(this.buf.data.slice(0,10));
    //turbo.run(this.buf, dim, headers + barrier + barrierTest);

    this._turboTransform(states);
    transform(states);

    var dataMatrix = this.buf.data.reduce(pack(4),[]);//.reduce(pack(bufferDim.x),[]);
    var l = dataMatrix.map(x => x[2]);
    console.log(states.low.slice(720,728));
    //console.log(dataMatrix.map(x => x[2]).slice(343,353));
    console.log(dataMatrix.map(x => x[2]).slice(720,728));
  }

  _turboTransform(states) {
    for(var i = 0; i < 27; i++) {
      turbo.run(this.buf, dim, headers + barrier + twist + barrierTest);
    }
  }

  _turboWriteBuffers(states) {
    for(var i = 0; i < STATE_LENGTH; i++) {
      this.buf.data[i * texelSize] = states.low[i];
      this.buf.data[i * texelSize + 1] = states.high[i];
      this.buf.data[i * texelSize + 2] = states.low[i];
      this.buf.data[i * texelSize + 3] = states.high[i];
    }
  }
}
