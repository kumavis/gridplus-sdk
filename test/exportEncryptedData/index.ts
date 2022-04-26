/**
 * Test export of encrypted data. Firmware allows certain pieces of sensitive
 * data to be exported in the form of encrypted data.
 * Different types of data will return different types of responses.
 * Every request requires the user to enter a password before exporting.
 * 
 * You must have `FEATURE_TEST_RUNNER10` enabled in firmware to run these tests.
 */
import { expect } from 'chai';
import { getFwVersionConst } from '../../src/constants';
import helpers from '../testUtil/helpers';

describe('Test Export Encrypted Data', () => {
  before(() => {
    global.test = {
      continue: true,
      client: helpers.setupTestClient(process.env),
      fwConstants: null,
      expect,
      helpers,
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

  it('Should load BLS keystore tests', async () => {
    require('./blsKeyEIP2335');
    global.test.continue = true;
  })
})