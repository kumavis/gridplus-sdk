require('it-each')({ testPerIteration: true });
const _ = require('lodash');
const constants = require('./../src/constants');
const abi = require('./../src/ethereumAbi');
const expect = require('chai').expect;
const helpers = require('./testUtil/helpers');
const question = require('readline-sync').question;
const seedrandom = require('seedrandom');
const numIter = process.env.N || 10;
const prng = new seedrandom(process.env.SEED || 'myrandomseed');

//---------------------------------------
// STATE DATA
//---------------------------------------
let client = null;
let caughtErr = null;

// Definitions and indices (the latter are used with it.each and must be defined at the
// top of the file).
// Boundary conditions are tested with `boundaryAbiDefs` and random definitions are
// filled into `abiDefs`.
const boundaryAbiDefs = [];
const boundaryIndices = [];
createBoundaryDefs();
const abiDefs = [];
const tupleAbiDefs = [];
const indices = [];
for (let i = 0; i < boundaryAbiDefs.length; i++)
  boundaryIndices.push({ i });
for (let i = 0; i < numIter; i++)
  indices.push({ i });

// Transaction params
const txData = {
  nonce: 0,
  gasPrice: 1200000000,
  gasLimit: 50000,
  to: '0xe242e54155b1abc71fc118065270cecaaf8b7768',
  value: 0,
  data: null
};
const req = {
  currency: 'ETH',
  data: {
    signerPath: [helpers.BTC_PURPOSE_P2PKH, helpers.ETH_COIN, constants.HARDENED_OFFSET, 0, 0],
    ...txData,
    chainId: 'rinkeby', // Can also be an integer
  }
}

//---------------------------------------
// INTERNAL HELPERS
//---------------------------------------


function createBoundaryDefs() {
  // Function with max of each type of uint
  function makeUintParam(type, val) {
    return { name: val.toString(), type: type, isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP[type] }
  }
  let def = {
    name: 'UintMaxVals',
    sig: null,
    params: [
      makeUintParam('uint8', '255'), 
      makeUintParam('uint16', '65535'),
      makeUintParam('uint32', '4294967295'),
      makeUintParam('uint64', '1.8446744073709e+19'),
      makeUintParam('uint128', '3.4028236692093e+38'),
      makeUintParam('uint256', '11579208923731e+77')
    ],
    _vals: [
      '0xff',
      '0xffff',
      '0xffffffff',
      '0xffffffffffffffff',
      '0xffffffffffffffffffffffffffffffff',
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    ]
  };

  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);
  // Min of each type of uint
  def = {
    name: 'UintMinVals',
    sig: null,
    params: [
      makeUintParam('uint8', '0'), 
      makeUintParam('uint16', '0'),
      makeUintParam('uint32', '0'),
      makeUintParam('uint64', '0'),
      makeUintParam('uint128', '0'),
      makeUintParam('uint256', '0')
    ],
    _vals: [
      '0x00',
      '0x00',
      '0x00',
      '0x00',
      '0x00',
      '0x00'
    ]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);

  // Int - check around 0
  def = {
    name: 'IntBoundaryVals',
    sig: null,
    params: [
      makeUintParam('int8', '-1'),
      makeUintParam('int8', '0'),
      makeUintParam('int8', '1'),
    ],
    _vals: [
      -1,
      0,
      1,
    ]
  };

  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);
  // Max int
  def = {
    name: 'IntMaxVals',
    sig: null,
    params: [
      makeUintParam('int8', '127'), 
      makeUintParam('int16', '32767'),
      makeUintParam('int32', '2147483647'),
      makeUintParam('int64', '9223372036854775807'),
      makeUintParam('int128', '170141183460469231731687303715884105727'),
      makeUintParam('int256', '57896044618658097711785492504343953926634992332820282019728792003956564819967')
    ],
    _vals: [
      '0x7f',
      '0x7fff',
      '0x7fffffff',
      '0x7fffffffffffffff',
      '0x7fffffffffffffffffffffffffffffff',
      '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    ]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);

  def = {
    name: 'IntMinVals',
    sig: null,
    params: [
      makeUintParam('int8', '-127'), 
      makeUintParam('int16', '-32767'),
      makeUintParam('int32', '-2147483647'),
      makeUintParam('int64', '-9223372036854775807'),
      makeUintParam('int128', '-170141183460469231731687303715884105727'),
      makeUintParam('int256', '-57896044618658097711785492504343953926634992332820282019728792003956564819967')
    ],
    _vals: [
      -127,
      -32767,
      -2147483647,
      '-0x7fffffffffffffff',
      '-0x7fffffffffffffffffffffffffffffff',
      '-0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    ]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);

  def = {
    name: 'IntZeros',
    sig: null,
    params: [
      makeUintParam('int8', '0'), 
      makeUintParam('int16', '0'),
      makeUintParam('int32', '0'),
      makeUintParam('int64', '0'),
      makeUintParam('int128', '0'),
      makeUintParam('int256', '0')
    ],
    _vals: [
      0,
      0,
      0,
      0,
      0,
      0,
    ]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);

  // Powers of 10
  def = {
    name: 'PowersOfTen',
    sig: null,
    params: [
      makeUintParam('uint8', '10'), 
      makeUintParam('uint16', '100'),
      makeUintParam('uint32', '10000'),
      makeUintParam('uint64', '100000000'),
      makeUintParam('uint128', '10000000000000000'),
      makeUintParam('uint256', '1+e32')
    ],
    _vals: [
      '0x0a',
      '0x64',
      '0x2710',
      '0x05f5e100',
      '0x2386f26fc10000',
      '0x04ee2d6d415b85acef8100000000',
    ]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);
  
  function makeParamSet(type) {
    return [
      { name: `${type}_0`, type: type, isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP[type] },
      { name: `${type}_1`, type: type, isArray: true, arraySz: 2, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP[type] },
      { name: `${type}_2`, type: type, isArray: true, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP[type] },
    ]
  }

  // bool, bool array (fixed), bool array (variable)
  def = {
    name: 'BooleanFiesta',
    sig: null,
    params: makeParamSet('bool'),
    _vals: [true, [false, true], [false, false, false, false, true, false]]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);

  // address, address array (fixed), address array (variable)
  def = {
    name: 'AddressesGalore',
    sig: null,
    params: makeParamSet('address'),
    _vals: [
      '0x0e9b7a0cfe43b6606be603a9a8b9335de93bace6',
      ['0x26c6d7ee87cf88537e423a443b3613cbb03b5072', '0xaea00d99767f52070b7757dec267fc3c362713d4'],
      ['0x4fd5c3ca2a9edbdb180349530bed84330cc08436']
    ]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);

  // bytes, bytes array (fixed), bytes array (variable)
  def = {
    name: 'BytesDump',
    sig: null,
    params: makeParamSet('bytes'),
    _vals: [
      Buffer.from('9df1', 'hex'), 
      [Buffer.from('70dab2213dc5a9', 'hex'), Buffer.from('0f472b', 'hex')],
      [Buffer.from('cc', 'hex')]
    ]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);

  // string, string array (fixed), string array (variable)
  def = {
    name: 'StringQuartet',
    sig: null,
    params: makeParamSet('string'),
    _vals: [
      'one', 
      ['twoone', 'twotwo'],
      ['three']
    ]
  };
  def._typeNames = helpers.getTypeNames(def.params);
  def.sig = helpers.buildFuncSelector(def);
  boundaryAbiDefs.push(def);
}

//---------------------------------------
// TESTS
//---------------------------------------
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

describe('Preloaded ABI definitions', () => {
  it('Should test preloaded ERC20 ABI defintions', async () => {
    const erc20PreloadedDefs = [
      {
        name: 'approve',
        sig: null,
        params: [ 
          { name: 'spender', type: 'address', isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP['address']},
          { name: 'value', type: 'uint256', isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP['uint256']},
        ],
        _vals: [
          '0x2a4e921a7da4d381d84c51fe466ff7288bf2ce41',
          10000,
        ]
      },
      {
        name: 'transferFrom',
        sig: null,
        params: [ 
          { name: 'from', type: 'address', isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP['address']},
          { name: 'to', type: 'address', isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP['address']},
          { name: 'value', type: 'uint256', isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP['uint256']},
        ],
        _vals: [
          '0x57974eb88e50cc61049b44e43e90d3bc40fa61c0',
          '0x39b657f4d86119e11de818e477a31c13feeb618c',
          9999,
        ]
      },
      {
        name: 'transfer',
        sig: null,
        params: [ 
          { name: 'to', type: 'address', isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP['address']},
          { name: 'value', type: 'uint256', isArray: false, arraySz: 0, latticeTypeIdx: constants.ETH_ABI_LATTICE_FW_TYPE_MAP['uint256']},
        ],
        _vals: [
          '0x39b657f4d86119e11de818e477a31c13feeb618c',
          1234,
        ]
      }
    ];
    erc20PreloadedDefs.forEach((def) => {
      def._typeNames = helpers.getTypeNames(def.params);
      def.sig = helpers.buildFuncSelector(def);
    })

    try {
      const approveDef = erc20PreloadedDefs[0]; 
      req.data.data = helpers.ensureHexBuffer(helpers.buildEthData(approveDef));
      await helpers.execute(client, 'sign', req);
    } catch (err) {
      caughtErr = 'Failed to markdown ERC20 approval def.';
      expect(err).to.equal(null);
    }
    try {
      const transfer = erc20PreloadedDefs[1]; 
      req.data.data = helpers.ensureHexBuffer(helpers.buildEthData(transfer));
      await helpers.execute(client, 'sign', req);
    } catch (err) {
      caughtErr = 'Failed to markdown ERC20 transfer def.';
      expect(err).to.equal(null);
    }
    try {
      const transferFrom = erc20PreloadedDefs[2]; 
      req.data.data = helpers.ensureHexBuffer(helpers.buildEthData(transferFrom));
      await helpers.execute(client, 'sign', req);
    } catch (err) {
      caughtErr = 'Failed to markdown ERC20 transferFrom def.';
      expect(err).to.equal(null);
    }
  })

})

describe('Add ABI definitions', () => {
  let defsToLoad = [];
  beforeEach(() => {
    expect(caughtErr).to.equal(null, 'Error found in prior test. Aborting.');
  })

  it(`Should generate and add ${numIter} ABI definitions to the Lattice`, async () => {
    try {
      for (let iter = 0; iter < numIter; iter++) {
        const def = helpers.createDef(client, prng);
        abiDefs.push(def);
        defsToLoad.push(def);
      }
    } catch (err) {
      caughtErr = err.toString();
      expect(err).to.equal(null, err);
    }
  })

  it(`Should generate and add ${numIter} tuple-based ABI defintions to the Lattice`, async () => {
    try {
      for (let iter = 0; iter < numIter; iter++) {
        const def = helpers.createTupleDef(client, prng);
        tupleAbiDefs.push(def);
        defsToLoad.push(def);
      }
    } catch (err) {
      caughtErr = err.toString();
      expect(err).to.equal(null, err);
    }
  })

  it('Should test parsing of a 0x V2 ABI via Etherscan', async () => {
    const funcDef = require('./testUtil/etherscanABI_0xV2.json');
    const newDefs = abi.abiParsers.etherscan([funcDef])
    defsToLoad = defsToLoad.concat(newDefs);
  })

  it('Should add the ABI definitions', async () => {
    try {
      await helpers.execute(client, 'addAbiDefs', boundaryAbiDefs.concat(defsToLoad));
    } catch (err) {
      caughtErr = err;
      expect(err).to.equal(null, err);
    }
  })
})

describe('Test ABI Markdown', () => {
  beforeEach(() => {
    expect(caughtErr).to.equal(null, 'Error found in prior test. Aborting.');
    req.data.data = null;
  })

  it('Should inform the user what to do', async () => {
    question('Please APPROVE all ABI-decoded payloads and REJECT all unformatted ones. Make sure the type matches the function name! Press enter.')
    expect(true).to.equal(true);
  })

  it('Should pass when variable arraySz is 0', async () => {
    const bytesDef = _.cloneDeep(boundaryAbiDefs[9])
    bytesDef._vals[2] = [];
    req.data.data = helpers.buildEthData(bytesDef);
    try {
      await helpers.execute(client, 'sign', req);
    } catch (err) {
      expect(err).to.not.equal(null, err);
    }
  })

  it('Should pass when dynamic param has size 0', async () => {
    const bytesDef = _.cloneDeep(boundaryAbiDefs[9])
    bytesDef._vals[2] = [Buffer.from('')];

    req.data.data = helpers.buildEthData(bytesDef);
    try {
      await helpers.execute(client, 'sign', req);
    } catch (err) {
      expect(err).to.not.equal(null, err);
    }
  })

  it.each(boundaryIndices, 'Test ABI markdown of boundary conditions #%s', ['i'], async (n, next) => {
    const def = boundaryAbiDefs[n.i];
    req.data.data = helpers.buildEthData(def)
    try {
      const sigResp = await helpers.execute(client, 'sign', req);
      expect(sigResp.tx).to.not.equal(null);
      expect(sigResp.txHash).to.not.equal(null);
      setTimeout(() => { next() }, 1000);
    } catch (err) {
      caughtErr = `Failed on tx #${n.i}: ${err.toString()}`;
      setTimeout(() => { next(err) }, 1000);
    }
  })

  it.each(indices, 'Test ABI markdown of payload #%s (non-tuple)', ['i'], async (n, next) => {
    const def = abiDefs[n.i];
    req.data.data = helpers.buildEthData(def)
    try {
      const sigResp = await helpers.execute(client, 'sign', req);
      expect(sigResp.tx).to.not.equal(null);
      expect(sigResp.txHash).to.not.equal(null);
      setTimeout(() => { next() }, 1000);
    } catch (err) {
      caughtErr = `Failed on tx #${n.i}: ${err.toString()}`;
      setTimeout(() => { next(err) }, 1000);
    }
  })

  it.each(indices, 'Test ABI markdown of payload #%s (tuple)', ['i'], async (n, next) => {
    const def = tupleAbiDefs[n.i];
    req.data.data = helpers.buildEthData(def)
    try {
      const sigResp = await helpers.execute(client, 'sign', req);
      expect(sigResp.tx).to.not.equal(null);
      expect(sigResp.txHash).to.not.equal(null);
      setTimeout(() => { next() }, 1000);
    } catch (err) {
      caughtErr = `Failed on tx #${n.i}: ${err.toString()}`;
      setTimeout(() => { next(err) }, 1000);
    }
  })

})