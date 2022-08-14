import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LoanAttributeComponent } from '../list/loan-attribute.component';
import { LoanAttributeDetailComponent } from '../detail/loan-attribute-detail.component';
import { LoanAttributeUpdateComponent } from '../update/loan-attribute-update.component';
import { LoanAttributeRoutingResolveService } from './loan-attribute-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const loanAttributeRoute: Routes = [
  {
    path: '',
    component: LoanAttributeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoanAttributeDetailComponent,
    resolve: {
      loanAttribute: LoanAttributeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoanAttributeUpdateComponent,
    resolve: {
      loanAttribute: LoanAttributeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoanAttributeUpdateComponent,
    resolve: {
      loanAttribute: LoanAttributeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loanAttributeRoute)],
  exports: [RouterModule],
})
export class LoanAttributeRoutingModule {}
