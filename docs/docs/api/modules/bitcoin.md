---
id: "bitcoin"
title: "Module: bitcoin"
sidebar_label: "bitcoin"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `buildBitcoinTxRequest` | (`data`: [`BitcoinTransactionData`](../interfaces/types_bitcoin.BitcoinTransactionData)) => [`BitcoinTransactionRequest`](../interfaces/types_bitcoin.BitcoinTransactionRequest) |
| `getAddressFormat` | (`path`: `any`) => ``0`` \| ``208`` \| ``240`` \| ``5`` \| ``196`` \| ``111`` |
| `getBitcoinAddress` | (`pubkeyhash`: `any`, `version`: `any`) => `any` |
| `serializeTx` | (`data`: { `crypto`: `any` ; `inputs`: [`Input`](../interfaces/types_bitcoin.Input)[] ; `isSegwitSpend`: `boolean` ; `lockTime`: `number` ; `outputs`: { `recipient`: `string` ; `value`: `string`  }[]  }) => `string` |

## Functions

### buildBitcoinTxRequest

▸ `Const` **buildBitcoinTxRequest**(`data`): [`BitcoinTransactionRequest`](../interfaces/types_bitcoin.BitcoinTransactionRequest)

We need to build two different objects here:
1. `bitcoinjs-lib` `TransactionBuilder` object, which will be used in conjunction
   with the returned signatures to build and serialize the transaction before
   broadcasting it. We will replace `bitcoinjs-lib`'s signatures with the ones
   we get from the Lattice.
2. The serialized Lattice request, which includes [BitcoinTransactionData](../interfaces/types_bitcoin.BitcoinTransactionData)
   that is needed to sign all of the inputs and build a change output.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`BitcoinTransactionData`](../interfaces/types_bitcoin.BitcoinTransactionData) |

#### Returns

[`BitcoinTransactionRequest`](../interfaces/types_bitcoin.BitcoinTransactionRequest)

#### Defined in

[bitcoin.ts:42](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/bitcoin.ts#L42)

___

### serializeTx

▸ `Const` **serializeTx**(`data`): `string`

Serialize a transaction consisting of inputs, outputs, and some
metadata

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` |  |
| `data.crypto` | `any` |  |
| `data.inputs` | [`Input`](../interfaces/types_bitcoin.Input)[] |  |
| `data.isSegwitSpend` | `boolean` | true if the inputs are being spent using segwit (NOTE: either ALL are being spent, or none are) |
| `data.lockTime` | `number` | - |
| `data.outputs` | { `recipient`: `string` ; `value`: `string`  }[] | expects an address string for `recipient` |

#### Returns

`string`

#### Defined in

[bitcoin.ts:129](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/bitcoin.ts#L129)
