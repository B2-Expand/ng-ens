const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { ENSRegistry, TestRegistrar, PublicResolver } = require('../compile');
const { namehash } = require('../utils/utils');

// Connect to the Ganache provider
const web3 = new Web3(ganache.provider());

let accounts, ens;
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    ens = await new web3.eth.Contract(JSON.parse(ENSRegistry.interface))
        .deploy({ data: ENSRegistry.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
})

describe('ENSRegistry', () => {
    it('Create a contract with an address', () => {
        assert.ok(ens.options.address);
    });
});