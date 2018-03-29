import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Services
import { EnsService } from './ens/ens';
import { NgEnsService } from './ng-ens';
import { EnsUtils } from './utils/ens-utils';
import { TestRegistrarService } from './registrar/test/test-registrar';
import { EthRegistrarService } from './registrar/eth/eth-registrar';
import { ResolverService } from './resolver/resolver';
import { PublicResolver } from './resolver';

// Component
import { NgEnsComponent } from './ng-ens.component';

// Eth
import { NgEthModule, EthContract } from 'ng-eth';
import { Provider } from './provider';  // TODO: Remove


@NgModule({
  declarations: [
    NgEnsComponent
  ],
  imports: [
    BrowserModule,
    NgEthModule.forRoot(Provider)
  ],
  providers: [
    EnsService,
    EnsUtils,
    NgEnsService,    
    TestRegistrarService,
    EthRegistrarService,
    ResolverService,
    PublicResolver
  ],
  bootstrap: [NgEnsComponent]
})
export class NgEnsModule { }
