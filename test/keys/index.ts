/**
 * Test derivations of various types of keys according to reference
 * implementations. Generally the process is that a seed is fetched from
 * the target Lattice and derivations are made in JS, then checked against
 * those coming from the LAttice.
 *
 * You must have `FEATURE_TEST_RUNNER=0` enabled in firmware to run these tests.
 */
import { expect } from 'chai';
import { getFwVersionConst } from '../../src/constants';
import helpers from '../testUtil/helpers';

describe('Test Key Derivation', () => {
  before(() => {
    global.test = {
      continue: true,
      client: helpers.setupTestClient(process.env),
      seed: null,
      fwConstants: null,
      expect,
      helpers,
      runWalletJob,
    };
    expect(global.test.client).to.not.equal(null);
  });

  beforeEach(() => {
    expect(global.test.continue).to.equal(true, 'Error in previous test.');
    global.test.continue = false;
  });

  it('Should connect to a Lattice and make sure it is already paired.', async () => {
    // Again, we assume that if an `id` has already been set, we are paired
    // with the hardcoded privkey above.
    global.test.continue = false;
    expect(process.env.DEVICE_ID).to.not.equal(null);
    const isPaired = await global.test.client.connect(process.env.DEVICE_ID);
    expect(isPaired).to.equal(true);
    expect(global.test.client.isPaired).to.equal(true);
    expect(global.test.client.hasActiveWallet()).to.equal(true);
    // Set the correct max gas price based on firmware version
    global.test.fwConstants = getFwVersionConst(global.test.client.fwVersion);
    if (!global.test.fwConstants.genericSigning) {
      global.test.continue = false;
      expect(true).to.equal(
        false,
        'Firmware must be updated to run this test.',
      );
    }
    if (
      global.test.client.fwVersion.major === 0 &&
      global.test.client.fwVersion.minor < 15
    ) {
      throw new Error('Please update Lattice firmware.');
    }
    global.test.continue = true;
  });

  it('Should export the seed', async () => {
    const activeWalletUID = helpers.copyBuffer(
      global.test.client.getActiveWallet().uid,
    );
    const jobType = helpers.jobTypes.WALLET_JOB_EXPORT_SEED;
    const jobData = {};
    const jobReq = {
      testID: 0, // wallet_job test ID
      payload: helpers.serializeJobData(jobType, activeWalletUID, jobData),
    };
    const res = await global.test.client.test(jobReq);
    const _res = helpers.parseWalletJobResp(res, global.test.client.fwVersion);
    global.test.continue = _res.resultStatus === 0;
    expect(_res.resultStatus).to.equal(0);
    const data = helpers.deserializeExportSeedJobResult(_res.result);
    global.test.seed = helpers.copyBuffer(data.seed);
    global.test.activeWalletUID = activeWalletUID;
    global.test.continue = true;
  });

  it('Should load BLS12-381 key tests', async () => {
    require('./bls12-381');
    global.test.continue = true;
  });
});

/**
 * Run a wallet job on the Lattice given a request.
 * Will throw an error if the response code does not match `expectedCode`
 * Returns the response.
 */
async function runWalletJob(jobReq, expectedCode) {
  const res = await global.test.client.test(jobReq);
  const parsedRes = helpers.parseWalletJobResp(res, global.test.client.fwVersion);
  continueTests = parsedRes.resultStatus === expectedCode;
  expect(parsedRes.resultStatus).to.equal(
    expectedCode,
    global.test.helpers.getCodeMsg(parsedRes.resultStatus, expectedCode),
  );
  return parsedRes;
}