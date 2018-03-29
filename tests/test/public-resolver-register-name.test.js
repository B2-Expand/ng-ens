const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { ENSRegistry, TestRegistrar, PublicResolver } = require('../compile');
const { namehash } = require('../utils/utils');

// Connect to the Ganache provider
const web3 = new Web3(ganache.provider());

// let accounts, ens, registrar, resolver;
const name = 'bob';
const node = namehash(web3, `${name}.test`);
const subnode = web3.utils.sha3(name);

/*
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // ENS Registry contract
    ens = await new web3.eth.Contract(JSON.parse(ENSRegistry.interface))
        .deploy({ data: ENSRegistry.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
    
    // Registrar Contract
    registrar = await new web3.eth.Contract(JSON.parse(TestRegistrar.interface))
        .deploy({ data: TestRegistrar.bytecode, arguments: [
            ens.options.address,
            namehash(web3, 'test')
        ]})
        .send({ from: accounts[0], gas: '1000000' });

    // Public resolver
    resolver = await new web3.eth.Contract(JSON.parse(PublicResolver.interface))
        .deploy({ data: PublicResolver.bytecode, arguments: [ens.options.address] })
        .send({ from: accounts[0], gas: '2000000' });
})
*/

/**
 * Register a name with a public resolver
 */
describe('Register a name with Public Resolver', () => {
    it('Create all contracts with an address', () => {
        assert.ok(ens.options.address && registrar.options.address && resolver.options.address);
    });
    it(`Name ${name} should be available`, async () => {
        const time = await registrar.methods['expiryTimes'](subnode).call();
        assert(new Date().getTime() > new Date(time * 1000).getTime());
    });
    it(`Register the default address with the name ${name} to the test registrar`, async () => {
        const register = await registrar.methods['register'](subnode, accounts[0])
            .send({ from: accounts[0], gas: '2000000' });
        console.log('Public register', register);
        assert.equal(register.blockNumber, 0);
    });
    it('Use the public resolver for the node', () => {
        ens.methods['setResolver'](node, resolver.options.address)
            .send({ from: accounts[0] })
            .on('receipt', (receipt) => assert.ok(receipt.blockNumber !== 0));
    });
    it(`Set the default address for the name ${name} with the public resolver`, () => {
        resolver.methods['setAddr'](node, accounts[0])
            .send({ from: accounts[0] })
            .on('receipt', (receipt) => assert.ok(receipt.blockNumber !== 0));
    });
    it(`Get the default address with the name ${name} with the public resolver`, () => {
        const register = registrar.methods['register'](subnode,accounts[0])
            .send({ from: accounts[0] });
        const useResolver = ens.methods['setResolver'](node, resolver.options.address)
            .send({ from: accounts[0] });
        const setAddress = resolver.methods['setAddr'](node, accounts[0])
            .send({ from: accounts[0] });
        const getAddress = ens.methods['resolver'](node).call();
        register
            .then(() => useResolver)
            .then(() => setAddress)
            .then(() => getAddress)
            .then((address) => assert.ok(address == accounts[0]));
    });
});