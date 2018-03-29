import { Injectable } from '@angular/core';
import { EthContract, EthAccounts } from 'ng-eth';
import { EnsService } from './../../ens/ens';
import { EnsUtils } from './../../utils/ens-utils';

import { abi } from './eth-registrar.abi';

// RXJS
import { take } from 'rxjs/operators';

@Injectable()
export class EthRegistrarService  {

    public contract;
    constructor(
        private ethAccounts: EthAccounts,
        private ethContract: EthContract,
        private ens: EnsService,
        private utils: EnsUtils
    ) {
        this.ens.owner(this.utils.namehash('eth'))
            .pipe(take(1))
            .subscribe((address: string) => this.setContract(address));
    }

    /**
     * Set the contract
     * @param address Address of the contract
     */
    private setContract(address: string) {
        this.contract = this.ethContract.create('ethRegistrar', abi as any, address, {
            from: this.ethAccounts.defaultAccount
        });
    }
}