import { Injectable } from '@angular/core';
import { EthContract, NgContract, EthAccounts } from 'ng-eth';
import { EnsService } from './../../ens/ens';
import { EnsUtils } from './../../utils/ens-utils';
import { abi } from './reverse-registrar.abi';

// RXJS
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

@Injectable()
export class ReverseRegistrarService {

    private name = 'reverseRegistrar';
    public contract: NgContract;
    
    constructor(
        private ethAccounts: EthAccounts,
        private ethContract: EthContract,
        private ens: EnsService,
        private utils: EnsUtils
    ) {
        this.ens.owner(this.utils.namehash('addr.reverse'))
            .pipe(take(1))
            .subscribe((address: string) => this.setContract(address));
    }

    private setContract(address: string) {
        this.contract = this.ethContract.create(this.name, abi as any, address, {
            from: this.ethAccounts.defaultAccount
        });
    }

    /**
     * Transfers ownership of the reverse ENS record associated with the calling account.
     * @param owner owner The address to set as the owner of the reverse record in ENS.
     */
    public claim(owner: string): Observable<string> {
        return this.ethContract.method(this.name, 'claim', [owner]);
    }

    /**
     * Transfers ownership of the reverse ENS record associated with the calling account.
     * @param owner owner The address to set as the owner of the reverse record in ENS.
     * @param resolver The address of the resolver to set; 0 to leave unchanged.
     */
    public claimWithResolver(owner: string, resolver: string): Observable<string> {
        return this.ethContract.method(this.name, 'claimWithResolver', [owner, resolver]);
    }

    /**
     * Sets the `name()` record for the reverse ENS record associated with
     * the calling account. First updates the resolver to the default reverse
     * resolver if necessary.
     * @param name The name to set for this address.
     */
    public setName(name: string): Observable<string> {
        return this.ethContract.method(this.name, 'setName', [name]);
    }

    /**
     * Returns the node hash for a given account's reverse records.
     * @param addr The address to hash
     */
    public node(addr: string): Observable<string> {
        return this.ethContract.method(this.name, 'node', [addr]);
    }
}