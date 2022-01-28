---
id: "ethereum"
title: "Module: ethereum"
sidebar_label: "ethereum"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `buildEthRawTx` | (`tx`: `any`, `sig`: `any`, `address`: `any`) => `any` |
| `buildEthereumMsgRequest` | (`input`: [`EthereumMessageInput`](../interfaces/types_ethereum.EthereumMessageInput)) => [`EthereumMessageRequest`](../interfaces/types_ethereum.EthereumMessageRequest) \| [`LatticeError`](../interfaces/types.LatticeError) |
| `buildEthereumTxRequest` | (`data`: [`EthereumTransactionRequestInput`](../interfaces/types_ethereum.EthereumTransactionRequestInput)) => [`EthereumTransactionRequest`](../interfaces/types_ethereum.EthereumTransactionRequest) \| [`LatticeError`](../interfaces/types.LatticeError) |
| `chainIds` | `Object` |
| `chainIds.goerli` | `number` |
| `chainIds.kovan` | `number` |
| `chainIds.mainnet` | `number` |
| `chainIds.rinkeby` | `number` |
| `chainIds.ropsten` | `number` |
| `ensureHexBuffer` | (`x`: `any`, `zeroIsNull`: `boolean`) => `Buffer` |
| `hashTransaction` | (`serializedTx`: `any`) => `string` |
| `validateEthereumMsgResponse` | (`res`: `any`, `req`: [`EthereumMessageRequest`](../interfaces/types_ethereum.EthereumMessageRequest)) => `any` |

## Variables

### chainIds

• **chainIds**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `goerli` | `number` |
| `kovan` | `number` |
| `mainnet` | `number` |
| `rinkeby` | `number` |
| `ropsten` | `number` |

#### Defined in

[ethereum.ts:554](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereum.ts#L554)

## Functions

### buildEthRawTx

▸ **buildEthRawTx**(`tx`, `sig`, `address`): `any`

Given a 64-byte signature [r,s] we need to figure out the v value and attach the full signature to
the end of the transaction payload.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `any` | The transaction object |
| `sig` | `any` | the signature object returned by `sign` |
| `address` | `any` | The address of the signer |

#### Returns

`any`

A new raw transaction with the signature attached to the end of the payload.

#### Defined in

[ethereum.ts:426](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereum.ts#L426)

___

### buildEthereumMsgRequest

▸ **buildEthereumMsgRequest**(`input`): [`EthereumMessageRequest`](../interfaces/types_ethereum.EthereumMessageRequest) \| [`LatticeError`](../interfaces/types.LatticeError)

It takes the input from the user, and builds a request object that can be sent to the Lattice
firmware.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`EthereumMessageInput`](../interfaces/types_ethereum.EthereumMessageInput) |

#### Returns

[`EthereumMessageRequest`](../interfaces/types_ethereum.EthereumMessageRequest) \| [`LatticeError`](../interfaces/types.LatticeError)

A request object that can be used to sign the message or an error

#### Defined in

[ethereum.ts:20](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereum.ts#L20)

___

### buildEthereumTxRequest

▸ **buildEthereumTxRequest**(`data`): [`EthereumTransactionRequest`](../interfaces/types_ethereum.EthereumTransactionRequest) \| [`LatticeError`](../interfaces/types.LatticeError)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`EthereumTransactionRequestInput`](../interfaces/types_ethereum.EthereumTransactionRequestInput) |

#### Returns

[`EthereumTransactionRequest`](../interfaces/types_ethereum.EthereumTransactionRequest) \| [`LatticeError`](../interfaces/types.LatticeError)

#### Defined in

[ethereum.ts:88](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereum.ts#L88)

___

### ensureHexBuffer

▸ **ensureHexBuffer**(`x`, `zeroIsNull?`): `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `x` | `any` | `undefined` |
| `zeroIsNull` | `boolean` | `true` |

#### Returns

`Buffer`

#### Defined in

[ethereum.ts:632](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereum.ts#L632)

___

### hashTransaction

▸ **hashTransaction**(`serializedTx`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serializedTx` | `any` |

#### Returns

`string`

#### Defined in

[ethereum.ts:495](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereum.ts#L495)

___

### validateEthereumMsgResponse

▸ **validateEthereumMsgResponse**(`res`, `req`): `any`

If the protocol is `signPersonal`, then we use the `keccak256` function to hash the message and then
we add the recovery param to the signature. If the protocol is `eip712`, then we use the
`TypedDataUtils.hash` function to hash the message and then we add the recovery param to the
signature.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `res` | `any` | The response from the Ethereum node |
| `req` | [`EthereumMessageRequest`](../interfaces/types_ethereum.EthereumMessageRequest) | { |

#### Returns

`any`

The `recoveryParam` is the `v` value of the signature.

#### Defined in

[ethereum.ts:60](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereum.ts#L60)
