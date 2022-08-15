import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditLimitComponent } from '../list/credit-limit.component';
import { CreditLimitDetailComponent } from '../detail/credit-limit-detail.component';
import { CreditLimitUpdateComponent } from '../update/credit-limit-update.component';
import { CreditLimitRoutingResolveService } from './credit-limit-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const creditLimitRoute: Routes = [
  {
    path: '',
    component: CreditLimitComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditLimitDetailComponent,
    resolve: {
      creditLimit: CreditLimitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditLimitUpdateComponent,
    resolve: {
      creditLimit: CreditLimitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditLimitUpdateComponent,
    resolve: {
      creditLimit: CreditLimitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(creditLimitRoute)],
  exports: [RouterModule],
})
export class CreditLimitRoutingModule {}
