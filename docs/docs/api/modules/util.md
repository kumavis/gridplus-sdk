---
id: "util"
title: "Module: util"
sidebar_label: "util"
sidebar_position: 0
custom_edit_url: null
---

## Variables

### signReqResolver

• **signReqResolver**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BTC` | (`data`: [`BitcoinTransactionData`](../interfaces/types_bitcoin.BitcoinTransactionData)) => [`BitcoinTransactionRequest`](../interfaces/types_bitcoin.BitcoinTransactionRequest) |
| `ETH` | (`data`: [`EthereumTransactionRequestInput`](../interfaces/types_ethereum.EthereumTransactionRequestInput)) => [`EthereumTransactionRequest`](../interfaces/types_ethereum.EthereumTransactionRequest) \| [`LatticeError`](../interfaces/types.LatticeError) |
| `ETH_MSG` | (`input`: [`EthereumMessageInput`](../interfaces/types_ethereum.EthereumMessageInput)) => [`EthereumMessageRequest`](../interfaces/types_ethereum.EthereumMessageRequest) \| [`LatticeError`](../interfaces/types.LatticeError) |

#### Defined in

[util.ts:101](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L101)

## Functions

### aes256\_decrypt

▸ **aes256_decrypt**(`data`, `key`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `key` | `any` |

#### Returns

`Buffer`

#### Defined in

[util.ts:148](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L148)

___

### aes256\_encrypt

▸ **aes256_encrypt**(`data`, `key`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `key` | `any` |

#### Returns

`Buffer`

#### Defined in

[util.ts:140](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L140)

___

### checksum

▸ **checksum**(`x`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `any` |

#### Returns

`number`

#### Defined in

[util.ts:81](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L81)

___

### getP256KeyPair

▸ **getP256KeyPair**(`priv`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `priv` | `any` |

#### Returns

`any`

#### Defined in

[util.ts:171](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L171)

___

### getP256KeyPairFromPub

▸ **getP256KeyPairFromPub**(`pub`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pub` | `any` |

#### Returns

`any`

#### Defined in

[util.ts:175](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L175)

___

### isValidAssetPath

▸ **isValidAssetPath**(`path`, `fwConstants`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `any` |
| `fwConstants` | `any` |

#### Returns

`boolean`

#### Defined in

[util.ts:107](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L107)

___

### parseDER

▸ **parseDER**(`sigBuf`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sigBuf` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `r` | `any` |
| `s` | `any` |

#### Defined in

[util.ts:155](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L155)

___

### parseLattice1Response

▸ **parseLattice1Response**(`r`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `any` |

#### Returns

`any`

#### Defined in

[util.ts:24](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L24)

___

### toPaddedDER

▸ **toPaddedDER**(`sig`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `any` |

#### Returns

`Buffer`

#### Defined in

[util.ts:89](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/util.ts#L89)
