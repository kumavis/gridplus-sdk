/*
Overview
---
This test script allows users to load a specified number of 
random ABI definitions/tags and follows up with a specified 
number of transaction requests using that data. 

An average latency will be printed at the end of the test
script, which will inform us how defs/tags are scaling.

Assumptions made:
1. User presses sign button with low latency
2. Internet connection to/from Lattice has low latency


Usage:
---
You can load data and/or send requests to your Lattice.
Depending on your testing goals you may want to do one or
both things in one test run.

The number of defs/tags to load and the number of requests
to send are dictated by environmental variables passed to
call this script.

NOTE: ALL PARAMS DEFAULT TO 0 - YOU NEED TO SPECIFY WHAT 
YOU WANT TO DO!

* OFF is the offset. Defs will use (OFF+i) indices. This is
  useful if you are trying to add e.g. 100 defs at a time
  and testing in between each loading. Note that this
  also affects which defs are referenced in the requests
* NUM_REQ defines the number of requests to send
* NUM_ABI defines the number of defs to load
* NUM_TAG defines the number of tags to load
*/

require('it-each')({ testPerIteration: true });
const crypto = require('crypto');
const expect = require('chai').expect;
const helpers = require('./testUtil/helpers')
let client;
let continueTests = true;
const off = parseInt(process.env.OFF) || 0;
const numReq = parseInt(process.env.NUM_REQ) || 0;
const indices = [];
const numDefs = parseInt(process.env.NUM_ABI) || 0;
const defs = [];
const numTags = parseInt(process.env.NUM_TAG) || 0;
const tags = {};
const times = [];

for (let i = 0; i < numReq; i++) {
  indices.push({ i });
}

const req = {
  currency: 'ETH',
  data: {
    signerPath: [
      helpers.BTC_PURPOSE_P2PKH, helpers.ETH_COIN, helpers.HARDENED_OFFSET, 0, 0
    ],
    nonce: 0,
    gasPrice: 1200000000,
    gasLimit: 50000,
    to: '0xe242e54155b1abc71fc118065270cecaaf8b7768',
    value: 100000,
    data: null
  }
}

function buildDef(idx) {
  const def = {
    name: `function_${idx}`,
    sig: null,
    params: [
      {
        name: 'forced_addr',
        type: 'address',
        isArray: false,
        arraySz: 0,
        latticeTypeIdx: 1
      },
    ],
    _typeNames: [ 'address' ],
  }
  def.sig = helpers.buildFuncSelector(def);
  return def;
}


describe('Setup client', () => {
  it('Should setup the test client', () => {
    client = helpers.setupTestClient(process.env);
    expect(client).to.not.equal(null);
  })

  it('Should connect to a Lattice and make sure it is already paired.', async () => {
    // Again, we assume that if an `id` has already been set, we are paired
    // with the hardcoded privkey above.
    expect(process.env.DEVICE_ID).to.not.equal(null);
    const connectErr = await helpers.connect(client, process.env.DEVICE_ID);
    expect(connectErr).to.equal(null);
    expect(client.isPaired).to.equal(true);
    expect(client.hasActiveWallet()).to.equal(true);
  });
})

describe('Generate secure data', () => {
  it(`Should generate and add ${numDefs} ABI definitions to the Lattice`, async () => {
    try {
      for (let iter = 0; iter < numDefs; iter++) {
        // Create a definition with a random name and an address param.
        // We need every def to have an address param to test tags.
        const def = buildDef(iter + off)
        defs.push(def);
      }
    } catch (err) {
      continueTests = false;
      expect(err).to.equal(null, err);
    }
  })

  it(`Should generate and add ${numTags} address tags to the Lattice`, async () => {
    try {
      for (let iter = 0; iter < numTags; iter++) {
        const addr = '0x' + crypto.randomBytes(20).toString('hex');
        tags[addr] = `address_${iter + off}`;
      }
    } catch (err) {
      continueTests = false;
      expect(err).to.equal(null, err);
    }
  })
})

describe('Load secure data', () => {
  it('Should add the ABI definitions', async () => {
    if (numDefs > 0) {
      try {
        await helpers.execute(client, 'addAbiDefs', defs);
      } catch (err) {
        continueTests = false;
        expect(err).to.equal(null, err);
      }
    }
  })

  it('Should add the address tags', async () => {
    if (numTags > 0) {
      try {
        await helpers.execute(client, 'addKvRecords', { 
          records: tags, caseSensitive: true, type: 0 
        });
      } catch (err) {
        expect(err).to.equal(null, err);
      }
    }
  })
})

describe('Test requests', async () => {
  before(() => {
    expect(continueTests).to.equal(true, 'Failed to build payloads. Aborting.');
  })

  beforeEach(() => {
    req.data.data = null;
  })

  it.each(indices, 'Request #%s', ['i'], async (n, next) => {
    const def = buildDef(n.i + off);
    def._vals = [ `0x${crypto.randomBytes(20).toString('hex')}` ];
    req.data.data = helpers.buildEthData(def)
    const start = new Date().getTime()
    try {
      const sigResp = await helpers.execute(client, 'sign', req);
      expect(sigResp.tx).to.not.equal(null);
      expect(sigResp.txHash).to.not.equal(null);
      times.push(new Date().getTime() - start)
      setTimeout(() => { next() }, 10);
    } catch (err) {
      setTimeout(() => { next(err) }, 10);
    }
  })

  it('Should report results', async () => {
    if (times.length > 0) {
      console.log(`Completed requests: ${times.length}/${numReq}`);
      const totalTime = times.reduce((a, b) => { return a + b })
      const avgTime = totalTime / times.length;
      const stdev = (times.reduce((a, b) => { return a + ((b - avgTime) ** 2) }) / (times.length - 1)) ** 0.5
      console.log(`Average round trip: ${(totalTime / times.length).toFixed(2)} ms (stdev ${stdev.toFixed(2)} ms)`)
    }
  })

})