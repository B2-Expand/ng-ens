/**
 * Hash a name into a 64 hex characters
 * @param web3 the current instance of web3
 * @param name the name to hash
 */
const namehash = function(web3, name) {
    let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (name !== '') {
        const labels = name.split(".");
        for(let i = labels.length - 1; i >= 0; i--) {
            node = web3.utils.sha3(node + web3.utils.sha3(labels[i]).slice(2), 'hex');
        }
    }
    return node.toString();
}

module.exports = { namehash };