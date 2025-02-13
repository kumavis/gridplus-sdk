// You must have `FEATURE_TEST_RUNNER10` enabled in firmware to run these tests.
import bip32 from 'bip32';
import { expect } from 'chai';
import seedrandom from 'seedrandom';
import helpers from './testUtil/helpers';
const prng = new seedrandom(process.env.SEED || 'myrandomseed');
const TEST_TESTNET = !!process.env.TESTNET || false;
let client,
  activeWalletUID,
  wallet = null,
  continueTests = true;


// Build the inputs. By default we will build 10. Note that there are `n` tests for
// *each category*, where `n` is the number of inputs.
function rand32Bit() {
  return Math.floor(prng.quick() * 2 ** 32);
}
const inputs = [];
const count = process.env.N ? process.env.N : 3;
for (let i = 0; i < count; i++) {
  const hash = Buffer.alloc(32);
  for (let j = 0; j < 8; j++) {
    // 32 bits of randomness per call
    hash.writeUInt32BE(rand32Bit(), j * 4);
  }
  const value = Math.floor(rand32Bit());
  const signerIdx = Math.floor(prng.quick() * 19); // Random signer (keep it inside initial cache of 20)
  const idx = Math.floor(prng.quick() * 25); // Random previous output index (keep it small)
  inputs.push({ hash: hash.toString('hex'), value, signerIdx, idx });
}

async function testSign(req, signingKeys, sigHashes) {
  const tx = await client.sign(req);
  expect(tx.sigs.length).to.equal(signingKeys.length);
  expect(tx.sigs.length).to.equal(sigHashes.length);
  for (let i = 0; i < tx.sigs.length; i++) {
    const sig = helpers.stripDER(tx.sigs[i]);
    const verification = signingKeys[i].verify(sigHashes[i], sig);
    if (!verification) continueTests = false;
    expect(verification).to.equal(true,
      `Signature validation failed for priv=${signingKeys[i].privateKey.toString('hex')}, `
      + `hash=${sigHashes[i].toString('hex')}, sig=${sig.toString('hex')}`);
  }
}

describe('Fetch wallet seed', () => {
  before(() => {
    client = helpers.setupTestClient(process.env);
  });

  it('Should connect to a Lattice and make sure it is already paired.', async () => {
    continueTests = false;
    expect(process.env.DEVICE_ID).to.not.equal(null);
    await client.connect(process.env.DEVICE_ID);
    expect(client.isPaired).to.equal(true);
    expect(client.hasActiveWallet()).to.equal(true);
    activeWalletUID = helpers.copyBuffer(client.getActiveWallet().uid);
    continueTests = true;
  });
});

describe('exportSeed', () => {
  it('Should get GP_SUCCESS for a known, connected wallet', async () => {
    expect(activeWalletUID).to.not.equal(null, 'No wallet found');
    const jobType = helpers.jobTypes.WALLET_JOB_EXPORT_SEED;
    const jobData = {};
    const jobReq = {
      testID: 0, // wallet_job test ID
      payload: helpers.serializeJobData(jobType, activeWalletUID, jobData),
    };

    const res = await client.test(jobReq);
    const _res = helpers.parseWalletJobResp(res, client.fwVersion);
    expect(_res.resultStatus).to.equal(0);
    const data = helpers.deserializeExportSeedJobResult(_res.result);
    const activeWalletSeed = helpers.copyBuffer(data.seed);
    wallet = bip32.fromSeed(activeWalletSeed);
  });
});

async function run(p) {
  await testSign(p.txReq, p.signingKeys, p.sigHashes);
}

async function runTestSet(opts, wallet, inputsSlice) {
  if (TEST_TESTNET) {
    // Testnet + change
    try {
      opts.isTestnet = true;
      opts.useChange = true;
      await run(
        helpers.setup_btc_sig_test(opts, wallet, inputsSlice, prng)
      );
    } catch (err) {
      expect(err).to.equal(
        null,
        `Failed in (testnet, change): ${err.message()}`
      );
      continueTests = false;
    }
    // Testnet + no change
    try {
      opts.isTestnet = true;
      opts.useChange = false;
      await run(
        helpers.setup_btc_sig_test(opts, wallet, inputsSlice, prng)
      );
    } catch (err) {
      expect(err).to.equal(
        null,
        `Failed in (testnet, !change): ${err.message()}`
      );
      continueTests = false;
    }
  }
  // Mainnet + change
  try {
    opts.isTestnet = false;
    opts.useChange = true;
    await run(
      helpers.setup_btc_sig_test(opts, wallet, inputsSlice, prng)
    );
  } catch (err) {
    expect(err).to.equal(
      null,
      `Failed in (!testnet, change): ${err.message()}`
    );
    continueTests = false;
  }
  // Mainnet + no change
  try {
    opts.isTestnet = false;
    opts.useChange = false;
    await run(
      helpers.setup_btc_sig_test(opts, wallet, inputsSlice, prng)
    );
  } catch (err) {
    expect(err).to.equal(
      null,
      `Failed in (!testnet, !change): ${err.message()}`
    );
    continueTests = false;
  }
}

describe('Test segwit spender (p2wpkh)', function () {
  beforeEach(() => {
    expect(continueTests).to.equal(true, 'Previous test failed. Aborting');
  });

  it('Should test p2wpkh->p2pkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2WPKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2PKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })

  it('Should test p2wpkh->p2sh-p2wpkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2WPKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2SH_P2WPKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })

  it('Should test p2wpkh->p2wpkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2WPKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2WPKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })
})

describe('Test wrapped segwit spender (p2sh-p2wpkh)', function () {
  beforeEach(() => {
    expect(continueTests).to.equal(true, 'Previous test failed. Aborting');
  });

  it('Should test p2sh-p2wpkh->p2pkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2SH_P2WPKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2PKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })

  it('Should test p2sh-p2wpkh->p2sh-p2wpkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2SH_P2WPKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2SH_P2WPKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })

  it('Should test p2sh-p2wpkh->p2wpkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2SH_P2WPKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2WPKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })
})

describe('Test legacy spender (p2pkh)', function () {
  beforeEach(() => {
    expect(continueTests).to.equal(true, 'Previous test failed. Aborting');
  });

  it('Should test p2pkh->p2pkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2PKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2PKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })

  it('Should test p2pkh->p2sh-p2wpkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2PKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2SH_P2WPKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })

  it('Should test p2pkh->p2wpkh', async () => {
    try {
      continueTests = false;
      for (let i = 0; i < inputs.length; i++) {
        expect(wallet).to.not.equal(null, 'Wallet not available');
        const inputsSlice = inputs.slice(0, i + 1);
        const opts = {
          spenderPurpose: helpers.BTC_PURPOSE_P2PKH,
          recipientPurpose: helpers.BTC_PURPOSE_P2WPKH,
        };
        await runTestSet(opts, wallet, inputsSlice);
        continueTests = true;
      }
    } catch (err) {
      expect(err).to.equal(null, err);
    }
  })
})
