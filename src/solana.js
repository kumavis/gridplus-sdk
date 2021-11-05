const bs58 = require('bs58');
const cbor = require('borc');
const constants = require('./constants');
const { getExtraDataPayloads } = require('./util');

exports.buildSolanaTxRequest = function(data) {
  try {
    const { signerPath, fwConstants, tx:_tx } = data;
    const { 
      extraDataFrameSz, 
      extraDataMaxFrames, 
      solanaMaxDataSz,
    } = fwConstants;
    // Make sure Solana is supported
    if (!solanaMaxDataSz) {
      throw new Error('Solana not supported by your firmware. Please update.');
    }
    const reqBuf = _buildSolanaTxRequest(_tx);
    const maxSz = solanaMaxDataSz + (extraDataMaxFrames * extraDataFrameSz);
    if (reqBuf.length > maxSz)
      throw new Error(`Request too large: got ${reqBuf.length} bytes, but max size is ${maxSz}`);
    let extraDataPayloads = [];
    if (reqBuf.length > solanaMaxDataSz) {
      // Spit into frames
      extraDataPayloads = getExtraDataPayloads(reqBuf.slice(solanaMaxDataSz), extraDataFrameSz);
    }
    return {
      extraDataPayloads,
      payload: reqBuf.slice(0, solanaMaxDataSz),
      schema: constants.signingSchema.SOLANA_TX,
      signerPath,
    }
  } catch (err) {
    return { err: err.message };
  }
}

// Expects an uncompiled @solana/web3.js Transaction type as input (`_tx`).
// Returns a serialized payload that can be sent to Lattice firmware.  
function _buildSolanaTxRequest(_tx) {
  try {
    const tx = _tx.compile();
    // CBOR-encode the data using custom keys
    const txEnc = {};
    // Add signers. These are not technically part of the message but they are important
    // information. The wallet will need to find corresponding secret keys.
    // IMPORTANT NOTE: Not all signers will be wallet-derived accounts. If the Lattice
    // cannot find the corresponding secret key it will return an empty signature.

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
    return cbor.encode(tx)
  } catch (err) {
    return new Error(`Failed to build Solana tx: ${err.message}`);
  }
}

// Get a set of unique signing accounts (public keys) from an *uncompiled* tx
function _getUniqueSigners(tx) {
  const signers = [];
  // Signers are packed into the `signatures` field
  tx.signatures.forEach((s) => {
    signers.push(Buffer.from(s.publicKey._bn.toString('hex'), 'hex'));
  })
  return signers;
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
  _signers: 'S12',
}