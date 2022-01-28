---
id: "ethereumAbi"
title: "Module: ethereumAbi"
sidebar_label: "ethereumAbi"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### default

• **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MAX_ABI_DEFS` | `number` |
| `abiParsers` | `Object` |
| `abiParsers.etherscan` | (`_defs`: `any`, `skipErrors`: `boolean`) => `any`[] |
| `buildAddAbiPayload` | (`defs`: `any`) => `Buffer` |
| `getFuncSig` | (`f`: `any`) => `string` |

## Variables

### MAX\_ABI\_DEFS

• **MAX\_ABI\_DEFS**: ``2``

#### Defined in

[ethereumAbi.ts:9](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereumAbi.ts#L9)

___

### abiParsers

• **abiParsers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `etherscan` | (`_defs`: `any`, `skipErrors`: `boolean`) => `any`[] |

#### Defined in

[ethereumAbi.ts:161](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereumAbi.ts#L161)

## Functions

### buildAddAbiPayload

▸ `Const` **buildAddAbiPayload**(`defs`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `defs` | `any` |

#### Returns

`Buffer`

#### Defined in

[ethereumAbi.ts:12](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereumAbi.ts#L12)

___

### getFuncSig

▸ `Const` **getFuncSig**(`f`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | `any` |

#### Returns

`string`

#### Defined in

[ethereumAbi.ts:105](https://github.com/GridPlus/gridplus-sdk/blob/5ca4955/src/ethereumAbi.ts#L105)
