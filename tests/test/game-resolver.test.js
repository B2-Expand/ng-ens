const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { ENSRegistry, GameResolver } = require('../compile');

// Connect to the Ganache provider
const web3 = new Web3(ganache.provider());

let accounts, ens, resolver;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    ens = await new web3.eth.Contract(JSON.parse(ENSRegistry.interface))
        .deploy({ data: ENSRegistry.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    resolver = await new web3.eth.Contract(JSON.parse(GameResolver.interface))
        .deploy({ data: GameResolver.bytecode, arguments: [ens.options.address] })
        .send({ from: accounts[0], gas: '2000000' });
})

describe('GameResolver', () => {
    it('Create a contract with an address', () => {
        assert.ok(resolver.options.address);
    });
});