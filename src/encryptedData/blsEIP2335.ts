/**
 * Export a BLS12-381 secret key in the form of an encrypted
 * keystore conforming to EIP2335
 */
import { EncryptedDataBlsEIP2335Req } from '../types/requests';
import { EncryptedDataBlsEIP2335Resp } from '../types/responses';
import { ENC_DATA_TYPES } from '../types/constants';

/**
 * Create serialized request data for exporting a BLS12-381 keystore
 */
export const get_req_BLS_KEYSTORE_EIP2335 =
  function (opts: EncryptedDataBlsEIP2335Req): Buffer 
{
  const out = Buffer.alloc(1025);
  let off = 0;
  out.writeUInt8(ENC_DATA_TYPES.BLS_KEYSTORE_EIP2335, off);
  off += 1;
  opts.walletUID.copy(out, off);
  off += opts.walletUID.length;
  out.writeUInt8(opts.path.length, off);
  off += 1;
  for (let i = 0; i < 5; i++) {
    if (i < opts.path.length) {
      out.writeUInt32LE(opts.path[i], off);
    }
    off += 4;
  }
  // password type is ignored for now
  out.writeUInt8(0, off);
  off += 1;
  out.writeUInt32LE(opts.iterations, off);
  off += 4;
  return out;
}

/**
 * Deserialize response data exporting a BLS12-381 keystore
 * according to EIP2335
 */
export const get_resp_BLS_KEYSTORE_EIP2335 = 
  function (data: Buffer): EncryptedDataBlsEIP2335Resp 
{
  const resp:EncryptedDataBlsEIP2335Resp = {
    keystore: null,
  }
  const params = {
    iterations: null,
    cipherText: null,
    salt: null,
    checksum: null,
    iv: null,
  };
  // Deserialize response buffer to get encryption params
  params.iterations = data.readUInt32LE(0);
  params.cipherText = data.slice(4, 36);
  params.salt = data.slice(36, 68);
  params.checksum = data.slice(68, 100);
  params.iv = data.slice(100, 116);
  // Construct the keystore JSON object
  const keystore = {
    crypto: {
      kdf: {
        // NOTE: Only pbkdf2 is supported at this time
        function: 'pbkdf2',
        params: {
          dklen: 32,
          c: params.iterations,
          prf: 'hmac-sha256',
          salt: params.salt.toString('hex')
        },
        message: '',
      },
      checksum: {
        function: 'sha256',
        params: {},
        message: params.checksum.toString('hex'),
      },
      cipher: {
        function: 'aes-128-ctr',
        params: {
          iv: params.iv.toString('hex')
        },
        message: params.cipherText.toString('hex')
      }
    }
  }
  resp.keystore = JSON.stringify(keystore);
  return resp;
}