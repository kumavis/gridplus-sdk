import 'hash.js';
import { ENC_DATA_TYPES } from './constants'
import { EncryptedDataBlsEIP2335Req } from './requests'
import { EncryptedDataBlsEIP2335Resp } from './responses'

export type KVRecord = {
  id?: number;
  type?: number;
  caseSensitive?: boolean;
  key?: string;
  val?: string;
};

export type SignData = {
  tx?: string;
  txHash?: string;
  changeRecipient?: string;
  sig?: {
    v: Buffer;
    r: Buffer;
    s: Buffer;
  };
  sigs?: Buffer[];
  signer?: Buffer;
  err?: string;
};

export type GetKvRecordsData = {
  records: {
    id: string;
    [key: string]: string;
  }[];
  fetched: number;
  total: number;
};

export type EncryptedDataReq = {
  encType: ENC_DATA_TYPES;
  blsKeystoreEIP2335?: EncryptedDataBlsEIP2335Req;
}

export type EncryptedDataResp = {
  encType: ENC_DATA_TYPES;
  blsKeystoreEIP2335?: EncryptedDataBlsEIP2335Resp;
}

