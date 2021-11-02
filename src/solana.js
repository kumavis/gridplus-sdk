const bs58 = require('bs58');
const cbor = require('cbor');

exports.buildSolanaTxRequest = function(data) {
  try {
    const { signerPath, fwConstants, tx:_tx } = data;
    const { 
      extraDataFrameSz, 
      extraDataMaxFrames, 
      prehashAllowed, 
      ethMaxDataSz:dataMaxSz 
    } = fwConstants;
    const FOO_SZ = dataMaxSz; // TODO: Figure out metadata offsets
    const reqBuffer = _buildSolanaTxRequest(_tx, FOO_SZ);
    
  


  } catch (err) {
    return err;
  }
}
// Expects an uncompiled @solana/web3.js Transaction type as input (`_tx`).
// Returns a serialized payload that can be sent to Lattice firmware.  
function _buildSolanaTxRequest(_tx, sz) {
  try {
    const tx = _tx.compile();
    const buf = Buffer.alloc(sz);
    // CBOR-encode the data using custom keys
    const txEnc = {};
    // 1. Metadata
    txEnc[NAME_CODES.numRequiredSignatures] = _bufNum(tx.numRequiredSignatures);
    txEnc[NAME_CODES.numReadonlySignedAccounts] = _bufNum(tx.numReadonlySignedAccounts);
    txEnc[NAME_CODES.numReadonlyUnsignedAccounts] = _bufNum(tx.numReadonlyUnsignedAccounts);
    txEnc[NAME_CODES.accountKeys] = [];
    tx.accountKeys.forEach((key) => {
      txEnc[NAME_CODES.accountKeys].push(Buffer.from(key._bn.toString('hex'), 'hex'))
    })
    txEnc[NAME_CODES.recentBlockHash] = bs58.decode(tx.recentBlockHash);
    // 2. Instructions
    txEnc[NAME_CODES.instructions] = [];
    tx.instructions.forEach((instruction) => {
      txEnc[NAME_CODES.instructions].push({
        [txEnc[NAME_CODES].programIdIndex]: _bufNum(instruction.programIdIndex),
        [txEnc[NAME_CODES]._accountsLength]: _bufNum(instruction.accounts.length),
        // `accounts` is an array of u8 indices so we can convert it to a buffer
        [txEnc[NAME_CODES].accounts]: Buffer.from(instruction.accounts),
        [txEnc[NAME_CODES]._dataLength]: _bufNum(instruction.data.length),
        [txEnc[NAME_CODES].data]: instruction.data,
      })
    })
    return buf;
  } catch (err) {
    return new Error(`Failed to build Solana tx: ${err.message}`);
  }
}

function _bufNum(n) {
  let s = n.toString(16)
  if (s.length % 2 > 0) s = `0${s}`;
  return Buffer.from(s, 'hex');
}

// To shorten the total amount of data sent over the wire, we
// replace parameter names with 3-character codes defined
// in Lattice firmware. The keys in this mapping come from
// the @solana/web3.js Transaction object.
const NAME_CODES = {
  numRequiredSignatures: 'S01',
  numReadonlySignedAccounts: 'S02',
  numReadonlyUnsignedAccounts: 'S03',
  accountKeys: 'S04',
  recentBlockHash: 'S05',
  instructions: 'S06',
  programIdIndex: 'S07',
  _accountsLength: 'S08',
  accounts: 'S09',
  _dataLength: 'S10',
  data: 'S11',
}