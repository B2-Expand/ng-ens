import { Injectable } from '@angular/core';
import { EthContract, NgContract, EthAccounts } from 'ng-eth';
import Web3 from 'web3';
import { abi } from './resolver.abi';
import { EnsService } from './../ens/ens';

// RXJS
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ResolverService {

    public contract: NgContract;

    constructor(
        private ethAccounts: EthAccounts,
        private ethContract: EthContract
    ) {
        this.contract = this.ethContract.createEmpty(abi as any, {
            from: this.ethAccounts.defaultAccount
        });
    }

    /**
     * Clone the contract with a new address
     * @param address the address to instanciate the contract with 
     */
    public clone(address: string): NgContract {
        const contract = Object.assign({}, this.contract);
        contract.options.address = address;
        return contract;
    }

    /**
     * Returns the address associated with an ENS node.
     * @param node The ENS node to query.
     * @param address The address of the contract
     */
    public addr(node: string, address: string): Observable<string> {
        return this.clone(address).methods['addr'](name);
    }

    /**
     * Returns the content hash associated with an ENS node.
     * Note that this resource type is not standardized, and will likely change
     * in future to a resource type based on multihash.
     * @param node The ENS node to query.
     * @param address The address of the contract
     */
    public content(node: string, address: string): Observable<string> {
        return this.clone(address).methods['addr'](name);
    }
}