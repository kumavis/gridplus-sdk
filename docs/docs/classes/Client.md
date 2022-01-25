---
id: "Client"
title: "Class: Client"
sidebar_label: "Client"
sidebar_position: 0
custom_edit_url: null
---

**`name`** Client

**`param`**

## Constructors

### constructor

• **new Client**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `ClientParams` |

#### Defined in

[client.ts:84](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L84)

## Properties

### activeWallets

• **activeWallets**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `external` | `Object` |
| `external.capabilities` | `any` |
| `external.external` | `boolean` |
| `external.name` | `any` |
| `external.uid` | `Buffer` |
| `internal` | `Object` |
| `internal.capabilities` | `any` |
| `internal.external` | `boolean` |
| `internal.name` | `any` |
| `internal.uid` | `Buffer` |

#### Defined in

[client.ts:69](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L69)

___

### baseUrl

• **baseUrl**: `string`

#### Defined in

[client.ts:58](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L58)

___

### crypto

• **crypto**: `any`

#### Defined in

[client.ts:59](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L59)

___

### deviceId

• **deviceId**: `any`

#### Defined in

[client.ts:66](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L66)

___

### ephemeralPub

• **ephemeralPub**: `any`

#### Defined in

[client.ts:63](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L63)

___

### isPaired

• **isPaired**: `boolean`

#### Defined in

[client.ts:67](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L67)

___

### key

• **key**: `any`

#### Defined in

[client.ts:62](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L62)

___

### name

• **name**: `any`

#### Defined in

[client.ts:60](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L60)

___

### pairingSalt

• **pairingSalt**: `any`

#### Defined in

[client.ts:82](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L82)

___

### privKey

• **privKey**: `any`

#### Defined in

[client.ts:61](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L61)

___

### retryCount

• **retryCount**: `any`

#### Defined in

[client.ts:68](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L68)

___

### sharedSecret

• **sharedSecret**: `any`

#### Defined in

[client.ts:64](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L64)

___

### timeout

• **timeout**: `any`

#### Defined in

[client.ts:65](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L65)

## Device Response Methods

### \_handleConnect

▸ **_handleConnect**(`res`): `boolean`

Connect will call `StartPairingMode` on the device, which gives the
user 60 seconds to finalize the pairing
This will return an ephemeral public key, which is needed for the next
request. If the device is already paired, this ephemPub is simply used
to encrypt the next request. If the device is not paired, it is needed
to pair the device within 60 seconds.

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `any` |

#### Returns

`boolean`

true if we are paired to the device already

#### Defined in

[client.ts:953](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L953)

___

### \_handleEncResponse

▸ **_handleEncResponse**(`encRes`, `len`): { `data`: `undefined` = res; `err`: `string`  } \| { `data`: `Buffer` = res; `err`: `any` = null }

All encrypted responses must be decrypted with the previous shared secret. Per specification,
decrypted responses will all contain a 65-byte public key as the prefix, which becomes the
new ephemeralPub.

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `encRes` | `any` |
| `len` | `any` |

#### Returns

{ `data`: `undefined` = res; `err`: `string`  } \| { `data`: `Buffer` = res; `err`: `any` = null }

#### Defined in

[client.ts:976](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L976)

___

### \_handleGetAddresses

▸ **_handleGetAddresses**(`encRes`): { `data`: `undefined` = res; `err`: `string`  } \| { `data`: `Buffer` = res; `err`: `any` = null } \| { `data`: `any`[] = addrs; `err`: `any` = null }

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `encRes` | `any` |

#### Returns

{ `data`: `undefined` = res; `err`: `string`  } \| { `data`: `Buffer` = res; `err`: `any` = null } \| { `data`: `any`[] = addrs; `err`: `any` = null }

an array of address strings

#### Defined in

[client.ts:1026](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1026)

___

### \_handleGetWallets

▸ **_handleGetWallets**(`encRes`): ``"No active wallet."`` \| { `data`: `undefined` = res; `err`: `string`  } \| { `data`: `Buffer` = res; `err`: `any` = null }

If there is an active wallet, return null. Otherwise, return an error message.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `encRes` | `any` | The encrypted response from the device. |

#### Returns

``"No active wallet."`` \| { `data`: `undefined` = res; `err`: `string`  } \| { `data`: `Buffer` = res; `err`: `any` = null }

A string. If the string is null, the wallet was successfully decrypted. If the string is
not null, it is an error message.

#### Defined in

[client.ts:1056](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1056)

___

### \_handlePair

▸ **_handlePair**(`encRes`): `any`

Pair will create a new pairing if the user successfully enters the secret
into the device in time. If successful (status=0), the device will return
a new ephemeral public key, which is used to derive a shared secret
for the next request

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `encRes` | `any` |

#### Returns

`any`

error (or null)

#### Defined in

[client.ts:1012](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1012)

___

### \_handleSign

▸ **_handleSign**(`encRes`, `currencyType`, `req?`): { `data`: `any` = null; `err`: `any` = null } \| { `err`: `any` = decrypted.err }

The function takes the encrypted response from the device and decrypts it. It then parses the
decrypted response and returns the data.

**`internal`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `encRes` | `any` | `undefined` | The encrypted response from the server |
| `currencyType` | `any` | `undefined` | The type of currency being signed. |
| `req` | `any` | `null` | - |

#### Returns

{ `data`: `any` = null; `err`: `any` = null } \| { `err`: `any` = decrypted.err }

The transaction data, the transaction hash, and the signature.

#### Defined in

[client.ts:1106](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1106)

___

### \_resetActiveWallets

▸ **_resetActiveWallets**(): `void`

Reset the active wallets to empty values.

**`internal`**

#### Returns

`void`

The active wallets.

#### Defined in

[client.ts:1261](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1261)

___

## Lattice Methods

### addAbiDefs

▸ **addAbiDefs**(`defs`, `cb`, `nextCode?`): `any`

We take a list of ABI definitions, and send them to the device in chunks of up to MAX_ABI_DEFS.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `defs` | `any` | `undefined` | An array of ABI definitions to add. |
| `cb` | `any` | `undefined` | The callback to call when the request is complete. |
| `nextCode` | `any` | `null` | - |

#### Returns

`any`

The decrypted response.

#### Defined in

[client.ts:415](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L415)

___

### addKvRecords

▸ **addKvRecords**(`opts`, `cb`): `any`

The function takes in a set of key-value records and adds them to the Lattice.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `any` | { |
| `cb` | `any` | (err, res) => { |

#### Returns

`any`

The response from the Lattice is a success or failure.

#### Defined in

[client.ts:601](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L601)

___

### addPermissionV0

▸ **addPermissionV0**(`opts`, `cb`): `any`

It takes in a currency, time window, spending limit, and decimals, and builds a payload to send to
the Lattice.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `any` | An object containing the following properties: |
| `cb` | `any` | The callback function to be called when the request is complete. |

#### Returns

`any`

The callback is called with an error if there is one, otherwise it is called with no
arguments.

#### Defined in

[client.ts:457](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L457)

___

### connect

▸ **connect**(`deviceId`, `cb`): `any`

`Connect` will attempt to contact a device based on its deviceId.
The response should include an ephemeral public key, which is used to
pair with the device in a later request

#### Parameters

| Name | Type |
| :------ | :------ |
| `deviceId` | `any` |
| `cb` | `any` |

#### Returns

`any`

#### Defined in

[client.ts:134](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L134)

___

### getAddresses

▸ **getAddresses**(`opts`, `cb`): `any`

Get the addresses associated with the active wallet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `any` | { |
| `cb` | `any` | callback function |

#### Returns

`any`

An array of addresses.

#### Defined in

[client.ts:242](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L242)

___

### getKvRecords

▸ **getKvRecords**(`opts`, `cb`): `any`

Get a list of key-value records from the Lattice.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `any` | { |
| `cb` | `any` | callback function |

#### Returns

`any`

The response is a buffer

#### Defined in

[client.ts:517](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L517)

___

### pair

▸ **pair**(`pairingSecret`, `cb`): `any`

If a pairing secret is provided, we use it to sign a hash of the public key, name, and pairing
secret. We then send the name and signature to the device. If no pairing secret is provided, we send
a zero-length name buffer to the device.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pairingSecret` | `any` | The pairing secret that was generated by the device. |
| `cb` | `any` | callback function |

#### Returns

`any`

The active wallet object.

#### Defined in

[client.ts:171](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L171)

___

### removeKvRecords

▸ **removeKvRecords**(`opts`, `cb`): `any`

Send a request to the Lattice to remove a set of KV records.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `any` | An object containing the following properties: |
| `cb` | `any` | The callback function to be called when the request is complete. |

#### Returns

`any`

A callback with an error or null.

#### Defined in

[client.ts:696](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L696)

___

### sign

▸ **sign**(`opts`, `cb`, `cachedData?`, `nextCode?`): `any`

The function takes in the options for the transaction, and then calls the signReqResolver function
to build the request. It then checks if there are any extra payloads to be sent, and if so, it
recursively calls itself to send the next payload. If there are no more payloads, it then calls the
_handleSign function to handle the response.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `opts` | `any` | `undefined` | { |
| `cb` | `any` | `undefined` | The callback function to call when the request is complete. |
| `cachedData` | `any` | `null` | - |
| `nextCode` | `any` | `null` | - |

#### Returns

`any`

The response from the device.

#### Defined in

[client.ts:326](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L326)

___

### test

▸ **test**(`data`, `cb`): `any`

it takes a testID and a payload, and sends them to the device.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | { |
| `cb` | `any` | callback function |

#### Returns

`any`

The decrypted data.

#### Defined in

[client.ts:218](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L218)

___

## Other Methods

### \_buildEncRequest

▸ **_buildEncRequest**(`enc_request_code`, `payload`): `Buffer`

Builds an encrypted request

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `enc_request_code` | `any` | The code for the encrypted request. This is a single byte |
| `payload` | `any` | The payload to be encrypted |

#### Returns

`Buffer`

The encrypted request.

#### Defined in

[client.ts:808](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L808)

___

### \_buildRequest

▸ **_buildRequest**(`request_code`, `payload`): `Buffer`

Build a request to send to the device.

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `request_code` | `any` |
| `payload` | `any` |

#### Returns

`Buffer`

#### Defined in

[client.ts:846](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L846)

___

### \_getActiveWallet

▸ **_getActiveWallet**(`cb`, `forceRefresh?`): `any`

Get the active wallet in the device. If we already have one recorded,
we don't need to do anything

**`internal`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cb` | `any` | `undefined` |
| `forceRefresh` | `boolean` | `false` |

#### Returns

`any`

cb(err) -- err is a string

#### Defined in

[client.ts:749](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L749)

___

### \_getEphemId

▸ **_getEphemId**(): `any`

Get the ephemeral id, which is the first 4 bytes of the shared secret
generated from the local private key and the ephemeral public key from
the device.

**`internal`**

#### Returns

`any`

Buffer

#### Defined in

[client.ts:793](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L793)

___

### \_getSharedSecret

▸ **_getSharedSecret**(): `Buffer`

Get the shared secret, derived via ECDH from the local private key
and the ephemeral public key

**`internal`**

#### Returns

`Buffer`

Buffer

#### Defined in

[client.ts:777](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L777)

___

### \_request

▸ **_request**(`data`, `cb`, `retryCount?`): `any`

Send a request to the device and wait for a response.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | The data to send to the device. |
| `cb` | `any` | The callback function that will be called when the request is complete. |
| `retryCount` | `any` | The number of times to retry the request if the device is busy. |

#### Returns

`any`

The response code.

#### Defined in

[client.ts:880](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L880)

___

### fwVersion

▸ **fwVersion**(`fwVersion`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fwVersion` | `any` | The version of the firmware that is being uploaded. |

#### Returns

`void`

#### Defined in

[client.ts:310](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L310)

___

### getActiveWallet

▸ **getActiveWallet**(): `Object`

Get the active wallet.

#### Returns

`Object`

The active wallet.

| Name | Type |
| :------ | :------ |
| `capabilities` | `any` |
| `external` | `boolean` |
| `name` | `any` |
| `uid` | `Buffer` |

#### Defined in

[client.ts:1275](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1275)

___

### hasActiveWallet

▸ **hasActiveWallet**(): `boolean`

Check if the user has an active wallet

#### Returns

`boolean`

The active wallet.

#### Defined in

[client.ts:1289](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1289)

___

### parseAbi

▸ **parseAbi**(`source`, `data`, `skipErrors?`): `any`

It takes a source and data as arguments, and returns the parsed ABI.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `source` | `any` | `undefined` | The name of the source of the ABI data. |
| `data` | `any` | `undefined` | The data to parse. |
| `skipErrors` | `boolean` | `false` | - |

#### Returns

`any`

The parsed ABI.

#### Defined in

[client.ts:1323](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1323)

___

### pubKeyBytes

▸ **pubKeyBytes**(`LE?`): `Buffer`

Get 64 bytes representing the public key
This is the uncompressed key without the leading 04 byte

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `LE` | `boolean` | `false` |

#### Returns

`Buffer`

A Buffer containing the public key.

#### Defined in

[client.ts:1300](https://github.com/GridPlus/gridplus-sdk/blob/c6ff435/src/client.ts#L1300)
