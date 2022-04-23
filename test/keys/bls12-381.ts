/**
 * These tests check derivations of BLS12-381 keys. This curve is used by
 * various different networks including ZCash and ETH2.
 * 
 * A secret key is derived from entropy according to EIP2333:
 * https://eips.ethereum.org/EIPS/eip-2333
 * 
 * The derivation paths are standardized in EIP2334:
 * https://eips.ethereum.org/EIPS/eip-2334
 * 
 * You must have `FEATURE_TEST_RUNNER10` enabled in firmware to run these tests.
 */

import { deriveSeedTree as deriveSecretKey } from 'bls12-381-keygen';
import { getPublicKey } from 'bls12-381';
import { BN } from 'bn.js';
import { question } from 'readline-sync';
import { Constants } from '../../src/index';

const cachedData = {
  seed: null,
  activeWalletUID: null,
};

describe('[BLS12-381]', () => {
  beforeEach(() => {
    test.expect(test.continue).to.equal(true, 'Error in previous test.');
    test.continue = false;
  })

  it('Should cache the current wallet seed', async () => {
    cachedData.seed = test.seed;
    cachedData.activeWalletUID = test.activeWalletUID;
    test.continue = true;
  })

  it('Should inform user the seed will be removed', async () => {
    await question(
      '\nThe following tests will remove your SafeCard seed.\n' +
      'Please ensure you have a SafeCard inserted and unlocked.\n' +
      'Press enter to continue.',
    );
    test.continue = true;
  })

  it('Should remove the seed', async () => {
    jobType = test.helpers.jobTypes.WALLET_JOB_DELETE_SEED;
    jobData = {
      iface: 1,
    };
    jobReq = {
      testID: 0, // wallet_job test ID
      payload: null,
    };
    jobReq.payload = test.helpers.serializeJobData(
      jobType,
      cachedData.activeWalletUID,
      jobData,
    );
    await test.runWalletJob(test.helpers.gpErrors.GP_SUCCESS);
    continueTests = true;
  })

  it('Should load a test seed', async () => {
    // Comes from reference EIP2333 document (linked at top of this file)
    const testSeed = Buffer.from(
      'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e5349553' +
      '1f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04'
    );
    jobType = test.helpers.jobTypes.WALLET_JOB_LOAD_SEED;
    jobData = {
      iface: 1, // external SafeCard interface
      seed: testSeed,
      exportability: 2, // always exportable
    };
    jobReq = {
      testID: 0, // wallet_job test ID
      payload: null,
    };
    jobReq.payload = test.helpers.serializeJobData(
      jobType,
      cachedData.activeWalletUID,
      jobData,
    );
    await test.runWalletJob(test.helpers.gpErrors.GP_SUCCESS);
    continueTests = true;
  })

  it('Should run EIP2333 test vector', async () => {
    // From EIP2333 test vectors
    const childSK = Buffer.from(
      new BN(
        '20397789859736650942317412262472558107875392172444076792671091975210932703118'
      )
      .toString('hex')
    );
    const childPub = getBLSPubKey(childSK);
    const req = {
      startPath: [0],
      n: 1,
      flag: Constants.GET_ADDR_FLAGS.BLS12_381_PUB_G1,
    };
    const pubKeys = await test.client.getAddresses(req);
    expect(pubKeys[0]).to.equal(childPub);
  })

  it('Should derive and check two ETH2 validator keys', async () => {
    // "The path for withdrawal keys is m/12381/3600/i/0 where i indicates" 
    // "the ith set of validator keys."

    // TODO: Allow user to specify which index to derive down
    // (will close)
    // const startPath = [12381, 3600, ]
  });
  it('Should derive and check two ETH2 signing keys');

})

function getBLSPubKey(x) {
  return Buffer.from(getPublicKey(x));
}
