const Buffer = require('buffer/').Buffer;
const cbor = require('borc');
const constants = require('./constants')
const { buildSignerPathBuf, getExtraData } = require('./util')

exports.buildGARTRequest = function(req) {
  const { fwConstants, data } = req;
  const { payload, signerPath } = data;
  const signingReq = {
    extraDataPayloads: [],
    payload: null,
    schema: constants.signingSchema.GART,
    signerPath,
  }

  // CBOR encode the raw payload. Different types of requests will have different
  // rules enforced in firmware
  const encData = Buffer.from(cbor.encode(payload));

  // Build a buffer containing the serialized BIP44_t data (5x signer path indices + sz u32)
  const signerPathBuf = buildSignerPathBuf(signerPath, fwConstants.varAddrPathSzAllowed);
  
  // Write the payload (not including extra data frames)
  let off = 0;
  signingReq.payload = Buffer.alloc(signerPathBuf + 2 + fwConstants.maxTxDataSz);
  signingReq.payload.writeUInt16LE(encData.length); off += 2;
  signerPathBuf.copy(signingReq.payload, off); off += signerPathBuf.length;
  encData.copy(signingReq.payload, off);

  // Attempt to split the request into multiple frames if it
  // won't fit in a single frame.
  signingReq.extraDataPayloads = getExtraData(encData, fwConstants);

  return signingReq;
}