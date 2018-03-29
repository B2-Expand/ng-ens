import { Injectable } from '@angular/core';

import { EthUtils, EthAccounts, PromiEvent } from 'ng-eth';

// ENS
import { EnsService } from './ens/ens';
import { TestRegistrarService } from './registrar/test/test-registrar';
import { EnsUtils } from './utils/ens-utils';
import { PublicResolver } from './resolver/public/public-resolver';

// RXJS
import { Observable } from 'rxjs/Observable';
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable() 
export class NgEnsService {

    constructor(
        private ethUtils: EthUtils,
        private ethAccounts: EthAccounts,
        private ens: EnsService,
        private testRegistrar: TestRegistrarService,
        private publicResolver: PublicResolver,
        private utils: EnsUtils
    ) {}

    /**
     * Check the avaibility of the name in test registrar
     * @param name 
     */
    public isAvailable(name: string): Observable<boolean> {
        return this.testRegistrar.expiryTimes(this.ethUtils.sha3(name))
            .pipe(
                map((time: number) => new Date(time * 1000)),
                map((date: Date) => new Date().getTime() >= date.getTime())
            );
    }


    /**
     * Register a name in the test registrar
     * @param name 
     */
    public registerName(name: string): Observable<any> {
        return this.testRegistrar.register(
          this.ethUtils.sha3(name),
          this.ethAccounts.defaultAccount
        )
    }

    /**
     * Tell the ENS registry to use the public resolver for your name:
     * @param name The name you want to register
     */    
    public usePublicResolver(name: string): Observable<PromiEvent<any>> {
        return this.ens.setResolver(
            this.utils.namehash(`${name}.test`),
            this.publicResolver.address
        )
    }

    /**
     * Set the address associated with the name into the public resolver
     * @param name the name to use for the address
     * @param address the address to save as a name
     */
    public setAddressPublic(name: string, address: string): Observable<PromiEvent<any>> {
        return this.publicResolver.setAddr(
            this.utils.namehash(`${name}.test`),
            address
        );
    }


    public getAddress(name: string) {
        return this.ens.resolver(
            this.utils.namehash(`${name}.test`)
        );
    }
}