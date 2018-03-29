import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

// ETH
import { EthUtils } from 'ng-eth';

// ENS
import { EnsService } from './../ens/ens';
import { ResolverService } from './../resolver/resolver';

// RXJS
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class EnsUtils {

    constructor(
        private ens: EnsService,
        private resolver: ResolverService,
        private ethUtils: EthUtils
    ){}


    /**
     * Hash a name into a 64 hex characters
     * @param name the name to hash
     */
    public namehash(name: string): string {
        let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
        if (name !== '') {
            const labels = name.split(".");
            for(let i = labels.length - 1; i >= 0; i--) {
                node = this.ethUtils.sha3(node + this.ethUtils.sha3(labels[i]).slice(2), 'hex');
            }
        }
        return node.toString();
    }

    /**
     * Get the address link to a name
     * @param node The ENS node to query 
     */
    public getAddr(name: string): Observable<string> {
        const node = this.namehash(name);
        return this.ens.resolver(node).pipe(
            switchMap((address: string) => this.resolver.addr(node, address))
        );
    }

    /**
     * Returns the content hash associated with an ENS node.
     * @param node The ENS node to query 
     */
    public getContent(name: string): Observable<string> {
        const node = this.namehash(name);
        return this.ens.resolver(node).pipe(
            switchMap((address: string) => this.resolver.content(node, address))
        );
    }
}