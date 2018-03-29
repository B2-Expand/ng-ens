import { Component, OnInit } from '@angular/core';

import { EthAccounts, PromiEvent } from 'ng-eth';

// ENS
import { NgEnsService } from './ng-ens';
import { TestRegistrarService } from './registrar/test/test-registrar';
import { PublicResolver } from './resolver';

// RXJS
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, filter, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'ng-ens',
  templateUrl: 'ng-ens.component.html',
  styles: []
})
export class NgEnsComponent implements OnInit {

  public account$: Observable<string | Error>;

  constructor(
    private ethAccounts: EthAccounts,
    private ngEns: NgEnsService,
    private testRegistrar: TestRegistrarService,
    private publicResolver: PublicResolver
  ){}


  public isAvailable(name: string) {
    this.ngEns.isAvailable(name)
        .subscribe(console.log);
  }

  /**
   * Register a name to the testRegistrar with the public resolver
   * @param name 
   */
  public registerPublic(name: string) {
    this.ngEns.isAvailable(name).pipe(
      tap((isAvailable: boolean) => {
        if (!isAvailable) { throw Error('Not available'); }
      }),
      filter((isAvailable: boolean) => !!isAvailable),
      switchMap(() => this.ngEns.registerName(name)),
      tap(() => console.log('Name registered')),
      switchMap(() => this.ngEns.usePublicResolver(name)),
      tap(() => console.log('Use Custom resolver')),
      switchMap(() => this.ngEns.setAddressPublic(name, this.ethAccounts.defaultAccount)),
      tap(() => console.log('Set the address'))
    ).subscribe(
      (register: PromiEvent<any>) => {
        console.log(register);
      },
      (err) => console.log('err', err)
    );
  }

  public getAddress(name: string) {
    this.ngEns.getAddress(name).subscribe(console.log);
  }

  ngOnInit() {
    this.account$ = this.ethAccounts.currentAccount();
  }
}