const path = require('path');
const fs = require('fs');
const solc = require('solc');

const getSource = (name) => {
    const contractPath = path.resolve(__dirname, 'contracts', name);
    return fs.readFileSync(contractPath, 'utf8');
}

const sources = {
    'ENS.sol': getSource('ENS.sol'),
    'ENSRegistry.sol': getSource('ENSRegistry.sol'),
    'TestRegistrar.sol': getSource('TestRegistrar.sol'),
    'PublicResolver.sol': getSource('PublicResolver.sol'),
    'GameResolver.sol': getSource('GameResolver.sol'),
}
const compiled = solc.compile({sources: sources}, 1).contracts;

const contracts = {
    ENSRegistry: compiled['ENSRegistry.sol:ENSRegistry'],
    TestRegistrar: compiled['TestRegistrar.sol:TestRegistrar'],
    PublicResolver: compiled['PublicResolver.sol:PublicResolver'],
    GameResolver: compiled['GameResolver.sol:GameResolver'],
}

module.exports = contracts;