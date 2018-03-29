import { Injectable } from '@angular/core';
import { EthContract, PromiEvent, EthAccounts } from 'ng-eth';
import { EnsService } from './../../ens/ens';
import { EnsUtils } from './../../utils/ens-utils';
import { abi } from './test-registrar.abi';

// RXJS
import { Observable } from 'rxjs/Observable';
import { take, tap, map } from 'rxjs/operators';

@Injectable()
export class TestRegistrarService  {

    private name = 'testRegistrar';
    public contract;
    constructor(
        private ethAccounts: EthAccounts,
        private ethContract: EthContract,
        private ens: EnsService,
        private utils: EnsUtils
    ) {
        this.ens.owner(this.utils.namehash('test'))
            .pipe(take(1))
            .subscribe((address: string) => this.setContract(address));
    }

    /**
     * Set the contract
     * @param address Address of the contract
     */
    private setContract(address: string) {
        this.contract = this.ethContract.create(this.name, abi as any, address);
    }

    /**
     * When a hashed name is expired
     * @param subnode the hash of a label
     */
    public expiryTimes(subnode: string): Observable<number> {
        console.log('expiryTime', 'subnode', subnode);
        return this.ethContract.method(this.name, 'expiryTimes', [subnode]).pipe(
            map((time: string) => parseInt(time, 10))
        );
    }

    /**
     * Register a name that's not currently registered
     * @param subnode The hash of the label to register.
     * @param owner The address of the new owner.
     */
    public register(subnode: string, owner: string): Observable<PromiEvent<any>> {
        console.log('Resigter', 'node', subnode, 'owner', owner);
        return this.ethContract.method(this.name, 'register', [subnode, owner], {
            from: this.ethAccounts.defaultAccount
        });
    }
}