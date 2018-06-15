const EC = require('elliptic').ec;
const EC_K = new EC('secp256k1');
const request = require('superagent');
// const internalCrypto = require('./internalCrypto.js');
// const enums = require('./enums.js');
// const permissions = require('./permissions.js');
const config = require('./config.js');
const bitcoin = require('./blockchain/bitcoin.js');
const ethereum = require('./blockchain/ethereum.js');

class GridPlusSDK {
  //============================================================================
  // SETUP OBJECT
  //============================================================================
  constructor(opts={}) {
    // Create a keypair either with existing entropy or system-based randomness
    this._initKeyPair(opts);
    this.headerKey = null;

    // If an ETH provider is included in opts, connect to the provider automatically
    if (opts.ethProvider !== undefined) this.connectToEth(opts.ethProvider);
  }

  //============================================================================
  // FUNCTIONALITY TO INTERACT WITH VARIOUS BLOCKCHAINS
  // We need to query both Bitcoin and Ethereum blockchains to get relevent
  // account data. This means connecting to nodes
  //============================================================================
  
  // Initialize a connection to an Ethereum node. 
  // @param [provider] {string} - of form `${protocol}://${host}:${port}`, where `protocol` is 'ws' or 'http'
  // @returns          {Error}  - may be null
  connectToEth(provider=null) {
    if (provider === null) return ethereum.initEth()
    else                   return ethereum.initEth(provider)
  }

  // Initialize a connection to Bitcoin node. 
  // @param [options] {object}
  // @returns         {Promise}
  connectToBtc(options={}) {
    return bitcoin.initBitcoin(options)
  }

  // Get the web3 connection for advanced functionality
  getProvider() {
    return ethereum.getProvider();
  }

  // Get a balance for an account. RETURNS A PROMISE!
  // @param [currency]  {string}  - "ETH", "ERC20", or "BTC"
  // @param [addr]      {string}  - The account we are querying
  // @param [ERC20Addr] {string}  - (optional) Address of the ERC20 token we are asking about
  // @returns           {Promise} - Contains the balance in full units (i.e. with decimals divided in)
  getBalance(currency, addr, ERC20Addr=null) {
    switch(currency) {
      case 'BTC':
        return bitcoin.getBalance(addr);
        break;
      case 'ETH': 
        return ethereum.getBalance(addr);
        break;
      case 'ERC20':
        return ethereum.getBalance(addr, ERC20Addr);
        break;
      default:
        return;
        break;
    }
  }

  // Get a history of transfers for the desired currency. RETURNS A PROMISE!
  // @param [currency]  {string}  - "ETH", "ERC20", or "BTC"
  // @param [addr]      {string}  - The account we are querying
  // @param [ERC20Addr] {string}  - (optional) Address of the ERC20 token we are asking about
  // @returns           {Promise} - Contains an object of form: { in: <Array> , out: <Array> }
  //                                See API documentation for schema of the nested arrays.
  getTransactionHistory(currency, user, ERC20Addr=null) {
    switch(currency) {
      case 'ETH':
        return []; // Todo, need to figure out a way to pull in simple transfers
        break;
      case 'ERC20':
        return ethereum.getERC20TransferHistory(user, ERC20Addr);
        break;
      default:
        return;
        break;
    }
  }

  // Get the number of transactions an address has made. This is needed for building ETH
  // transactions and may be useful for BTC as well
  // @param [system]  {string}  - "ETH" or "BTC"
  // @param [user]    {string}  - Account we are querying
  // @returns         {Promise} - Contains a number
  getTransactionCount(system, user) {
    switch (system) {
      case 'ETH':
        return ethereum.getNonce(user);
        break;
      default:
        return;
        break;
    }
  }

  //============================================================================
  // COMMS WITH AGENT
  //============================================================================

  // Initiate comms with a particular agent
  connect(id) {
    return new Promise((resolve, reject) => {
      const url = `${config.api.baseUrl}/headerKey`;
      request.post(url)
      .then((res) => {
        if (!res.body) return reject(`No body returned from ${url}`)
        else if (!res.body.headerKey) return reject(`Incorrect response body from ${url}`)
        else {
          this.headerKey = res.body.headerKey;
          return resolve(true);
        }
      })
      .catch((err) => {
        return reject(err);
      })
    })
  }

/*
  // Add a device based on a host
  addDevice(host, id, cb) {
    this.hosts[id] = host;
    // In case this id is re-used, overwrite other instances
    this.ids[id] = null;
    this.tokens[id] = null;
    this.pairings[id] = null;
    // TODO Ping the device and make sure it's a valid Grid+ agent
    cb(null);
  }

  // Look a device up via Grid+ service given a name
  lookupDevice(serial, cb) {
    const opts = {
      hostname: config.commsServer.host,
      port: config.commsServer.port,
      path: `/ip?serial=${serial}`,
    };
    http.get(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; })
      res.on('end', () => { cb(null, JSON.parse(data)); })
      res.on('err', (err) => { cb(err); })
    })
  }


  request(endpoint, payload, device, cb) {
    const t = this.tokens[device];
    const id = this.ids[device];
    if (t === null || t === undefined || id === null || id === undefined) {
      cb('No token saved for this device. Please call getToken with the device id.');
    } else if (this.headerKey === null || this.headerKey === undefined) {
      cb('No header key saved. Please call getHeaderKey.');
    } else {
      let req = {
        id: this.ids[device],
        pubKey: this.pubKey,
      }
      let body = {
        type: endpoint,
        data: payload,
      }
      internalCrypto.ecsign(payload, this.privKey, (err, sig) => {
        if (err) { cb(err); }
        else {
          body.sig = sig;
          internalCrypto.encrypt(body, t, (err, encBody) => {
            req.body = encBody;
            internalCrypto.encrypt(req, this.headerKey, (err, encReq) => {
              if (err) { cb(err); }
              else {
                // Send the request somewhere
                console.log('sending out request', encReq);
              }
            })
          })
        }
      })
    }
  }

  //============================================================================
  // SYNC REQUESTS
  //
  // These requests are synchronous in that the response is returned with the
  // request (i.e. the request is not queued in the agent)
  //============================================================================

  // Get the public header key to encrypt async requests
  getHeaderKey() {
    return this.pubKey.toString('hex');
  }

  // Get an access token once you are paired
  getToken(device, cb) {
    this.request('getToken', { pubKey: this.pubKey }, (err, encToken) => {
      if (err) { cb(err); }
      else {
        this.ids[device] = this._hashId(encToken);
        // Returns an encrypted token
        internalCrypto.decrypt(encToken, this.privKey, (err, decToken) => {
          if (err) { cb(err); }
          else {
            this.tokens[device] = decToken;
            cb(null, decToken);
          }
        });
      }
    });
  }

  // Get the response of a request given an id
  getResponse(id, device, cb) {
    this.request('getResponse', { id: id }, device, cb);
  }

  //============================================================================
  // ASYNC REQUESTS
  //
  // Each of these requires a token to be generated and then stored (via getToken).
  // The response will contain a request id, which can be used with getResponse
  // to get the return payload once the request passes through the agent's queue.
  //============================================================================

  // Add a pairing
  addPairing(opts, cb) {
    const { appSecret, deviceSecret, name, device } = opts;
    if (!deviceSecret || !appSecret || !name || !device) {
      cb('Missing one or more parameters')
    } else {
      const fullSecret = `${deviceSecret}${appSecret}`;
      internalCrypto.ecsign(fullSecret, privKey, (err, sig) => {
        if (err) { cb(err); }
        else {
          const payload = [name, sig];
          const data = enums.formatArr(payload);
          this.request('addPairing', data, device, cb);
        }
      })
    }
  }

  // Remove a pairing
  deletePairing(device, cb) {
    if (!device) {
      cb('Missing one or more parameters');
    } else {
      this.request('deletePairing', {}, device, cb);
    }
  }

  // Create a permission given a pairing
  addPermission(opts, cb) {
    if (!opts.schema || !opts.type || !opts.rules || !opts.timeLimit || !opts.device) {
      cb('Missing one or more parameters');
    } else {
      const { schema, type, rules, timeLimit, device } = opts;
      // Check all inputs
      const schemaErr = permissions.getSchemaErr(schema, type);
      const rulesErr = permissions.getRulesErr(rules);
      const timeLimitErr = permissions.getTimeLimitErr(timeLimit);
      if (schemaErr != null) { cb(schemaErr); }
      else if (rulesErr != null) { cb(rulesErr); }
      else if (timeLimitErr != null) { cb(timeLimitErr); }
      else {
        // Format the request for the k81
        const parsedRules = permissions.parseRules(rules);
        const schemaIdx = enums.schemas[schema].index;
        const typeIdx = enums.types[type].index;
        const payload = [ schemaIdx, typeIdx, enums.formatArr(parsedRules), timeLimit ];
        // Sign and send payload
        internalCrypto.ecsign(enums.formatArr(payload), privKey, (err, sig) => {
          payload.push(sig);
          const data = enums.formatArr(payload);
          reqFunc('addPermission', data, device, cb);
        })
      }
    }
  }

  // Get the number of permissions associated with your
  getNumPermissions(device, cb) {
    if (!device) {
      cb('Missing one or more parameters');
    } else {
      this.request('getPermissionCount', {}, device, cb);
    }
  }

  // Get a permission given an index
  getPermission(index, device, cb) {
    if (!index || !device) {
      cb('Missing one or more parameters');
    } else {
      this.request('getPermission', { index: index }, device, cb);
    }
  }

  // Get a unique id from an encrypted payload.
  _hashId(token) {
    let id = `${token.iv.toString('hex')}${token.ephemPublicKey.toString('hex')}`;
    id = `${id}${token.ciphertext.toString('hex')}${token.mac.toString('hex')}`;
    return id;
  }
*/

  // Create an EC keypair. Optionally, a passphrase may be provided as opts.entropy
  _initKeyPair(opts) {
    // Create the keypair
    if (opts.entropy === undefined) {
      this.key = EC_K.genKeyPair();
    } else {
      if (opts.entropy.length < 20) {
        console.log('WARNING: Passphrase should be at least 20 characters. Please consider using a longer one.');
        for (let i = 0; i < 20 - opts.entropy.length; i++) opts.entropy += 'x';
        this.key = EC_K.genKeyPair({ entropy: opts.entropy });
      }
    }
    // Add the public key
    this.key.pub = this.key.getPublic();
  }
}

exports.default = GridPlusSDK;
