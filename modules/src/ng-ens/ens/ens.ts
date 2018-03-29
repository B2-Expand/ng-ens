import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { EthContract, EthUtils, PromiEvent, NgContract, EthAccounts } from 'ng-eth';
import { abi } from './ens.abi';

// RXJS
import { Observable } from 'rxjs/Observable';

// TODO : Check the network instead of environment
const mainAddress = '0x314159265dd8dbb310642f98f50c066173c1259b';
const testAddress = '0x112234455c3a32fd11230c42e7bccd4a84e02010';

@Injectable()
export class EnsService {

    private name = 'ens';
    public address = environment.production ? mainAddress : testAddress;
    public contract: NgContract;

    constructor(
        private ethAccounts: EthAccounts,
        private ethContract: EthContract,
        private ethUtils: EthUtils
    ) {
        this.contract = this.ethContract.create(this.name, abi as any, this.address, {
            from: this.ethAccounts.defaultAccount
        });
    }


    /*************
     * SEND METHOD
     */

    /**
     * Transfers ownership of a subnode keccak256(node, label) to a new address. May only be called by the owner of the parent node.
     * @param node The parent node.
     * @param label The hash of the label specifying the subnode.
     * @param owner The address of the new owner.
     */
    public setSubnodeOwner(node: string, label: string, owner: string): Observable<PromiEvent<any>> {
        return this.ethContract.method(this.name, 'setSubnodeOwner', [node, label, owner]);
    }

    /**
     * Sets the resolver address for the specified node.
     * @param node The node to update.
     * @param resolver The address of the resolver.
     */
    public setResolver(node: string, resolver: string): Observable<PromiEvent<any>> {
        return this.ethContract.method(this.name, 'setResolver', [node, resolver], {
            from: this.ethAccounts.defaultAccount
        });
    }

    /**
     * Transfers ownership of a node to a new address. May only be called by the current owner of the node.
     * @param node The node to transfer ownership of.
     * @param owner The address of the new owner.
     */
    public setOwner(node: string, owner: string): Observable<PromiEvent<any>> {
        return this.ethContract.method(this.name, 'setSubnodeOwner', [node, owner]);
    }

    /**
     * Sets the Time To Live for the specified node.
     * @param node The node to update.
     * @param ttl The TTL in seconds.
     */
    public setTTL(node: string, ttl: number): Observable<PromiEvent<any>> {
        return this.ethContract.method(this.name, 'setSubnodeOwner', [node, ttl]);
    }

    /*************
     * CALL METHOD
     */

    /**
     * Returns the address that owns the specified node.
     * @param node The specified node.
     * @return address of the owner.
     */
    public owner(node: string): Observable<string> {
        return this.ethContract.method(this.name, 'owner', [node]);
    }

    /**
     * Returns the address of the resolver for the specified node.
     * @param node The specified node.
     */
    public resolver(node: string): Observable<string> {
        return this.ethContract.method(this.name, 'resolver', [node]);
    }

    /**
     * Returns the TTL of a node, and any records associated with it.
     * @param node The specified node.
     */
    public ttl(node: string): Observable<number> {
        return this.ethContract.method(this.name, 'ttl', [node]);
    }


    /************
     * EVENT
     */
    /**
     * Logged when the owner of a node assigns a new owner to a subnode.
     */
    public NewOwner() {
        // TODO : returns {node: string, label: string, owner: string}
    };

    public Transfer() {
        // TODO : returns {node: string, owner: string}
    }
    public NewResolver() {
        // TODO : returns {node: string, resolver: string}
    }
    public NewTTL() {
        // TODO : returns {node: string, ttl: number}
    }
}