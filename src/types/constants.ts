export enum GET_ADDR_FLAGS {
  SECP256K1_PUB = 3,
  ED25519_PUB = 4,
}

export enum SIGNING_HASHES {
  NONE = 0,
  KECCAK256 = 1,
  SHA256 = 2,
}

export enum SIGNING_CURVES {
  SECP256K1 = 0,
  ED25519 = 1,
}

export enum SIGNING_ENCODINGS {
  NONE = 1,
  SOLANA = 2,
  TERRA = 3,
  EVM = 4,
}

export enum ENC_DATA_TYPES {
  BLS_KEYSTORE_EIP2335 = 0,
}