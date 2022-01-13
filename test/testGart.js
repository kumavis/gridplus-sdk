const helpers = require('./testUtil/helpers');

let client = null;
const DEFAULT_SIGNER = [
  helpers.BTC_PURPOSE_P2PKH, helpers.ETH_COIN, helpers.HARDENED_OFFSET, 0, 0
];

describe('Setup client', () => {
  it('Should setup the test client', () => {
    client = helpers.setupTestClient(process.env);
    expect(client).to.not.equal(null);
  })

  it('Should connect to a Lattice and make sure it is already paired.', async () => {
    // Again, we assume that if an `id` has already been set, we are paired
    // with the hardcoded privkey above.
    expect(process.env.DEVICE_ID).to.not.equal(null);
    const connectErr = await helpers.connect(client, process.env.DEVICE_ID);
    expect(connectErr).to.equal(null);
    expect(client.isPaired).to.equal(true);
    expect(client.hasActiveWallet()).to.equal(true);
  });
})

describe('Test GART',  () => {
  it('Should test a transaction', async () => {
    const req = {
      signerPath: DEFAULT_SIGNER,
      txData: {
        format: 'your request',
        in: 'this object'
      }
    }
    const res = await helpers.execute(client, 'sign', req);
    console.log('Response:', res)
  })
})