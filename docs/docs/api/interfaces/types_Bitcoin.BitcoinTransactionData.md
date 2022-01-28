---
id: "types_bitcoin.BitcoinTransactionData"
title: "Interface: BitcoinTransactionData"
sidebar_label: "BitcoinTransactionData"
custom_edit_url: null
---

[types/bitcoin](../modules/types_bitcoin).BitcoinTransactionData

## Properties

### changePath

• **changePath**: `any`[]

TODOC

#### Defined in

types/Bitcoin.ts:31

___

### fee

• **fee**: `number`

Number of satoshis to use for a transaction fee (should have been calculated) already based on the number of inputs plus two outputs

#### Defined in

types/Bitcoin.ts:37

___

### isSegwit

• **isSegwit**: `boolean`

a boolean which determines how we serialize the data and parameterize txb

#### Defined in

types/Bitcoin.ts:41

___

### prevOuts

• **prevOuts**: [`Output`](types_bitcoin.Output)[]

TODOC

#### Defined in

types/Bitcoin.ts:29

___

### recipient

• **recipient**: `string`

Receiving address, which must be converted to a pubkeyhash

#### Defined in

types/Bitcoin.ts:33

___

### value

• **value**: `number`

Number of satoshis to send the recipient

#### Defined in

types/Bitcoin.ts:35

___

### version

• **version**: `string`

Transaction version of the inputs. All inputs must be of the same version!

#### Defined in

types/Bitcoin.ts:39
