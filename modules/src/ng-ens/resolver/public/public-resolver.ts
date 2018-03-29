import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

import { NgContract, EthContract, PromiEvent, EthAccounts } from 'ng-eth';
import { EnsService } from './../../ens/ens';
import { EnsUtils } from './../../utils/ens-utils';

// RXJS
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import { abi } from '../resolver.abi';

@Injectable()
export class PublicResolver {
    
    private contract: NgContract;
    private name = 'publicResolver';
    public address: string;

    constructor(
        private ethAccounts: EthAccounts,
        private ethContract: EthContract,
        private ens: EnsService,
        private utils: EnsUtils
    ) {
        this.setContract();
    }

    /**
     * Set the address and contract of the public resolver
     */
    private setContract() {
        if (!environment.production) {
            this.address = '0x4c641fb9bad9b60ef180c31f56051ce826d21a9a';
            this.contract = this.ethContract.create(this.name, abi as any, this.address);
        } else {
            this.ens.owner(this.utils.namehash('resolver.eth'))
                .pipe(take(1))
                .subscribe((address: string) => {
                    this.address = address;
                    this.contract = this.ethContract.create(this.name, abi as any, this.address)
                });
        }
    }

    /**
     * Sets the address associated with an ENS node.
     * May only be called by the owner of that node in the ENS registry.
     * @param node The node to update.
     * @param addr The address to set.
     */
    public setAddr(node: string, addr: string): Observable<PromiEvent<any>> {
        return this.ethContract.method(this.name, 'setAddr', [node, addr], {
            from: this.ethAccounts.defaultAccount
        });
    }
}