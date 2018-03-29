import { Injectable } from '@angular/core';
const Web3 = require('web3');

@Injectable()
export class Provider {

    get provider() {
        return Web3.givenProvider || 'https://ropsten.infura.io/Ge8pLCXZNKUB86c7miUf';
    }
}