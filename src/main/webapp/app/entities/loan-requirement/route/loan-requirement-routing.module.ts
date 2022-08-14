import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LoanRequirementComponent } from '../list/loan-requirement.component';
import { LoanRequirementDetailComponent } from '../detail/loan-requirement-detail.component';
import { LoanRequirementUpdateComponent } from '../update/loan-requirement-update.component';
import { LoanRequirementRoutingResolveService } from './loan-requirement-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const loanRequirementRoute: Routes = [
  {
    path: '',
    component: LoanRequirementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoanRequirementDetailComponent,
    resolve: {
      loanRequirement: LoanRequirementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoanRequirementUpdateComponent,
    resolve: {
      loanRequirement: LoanRequirementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoanRequirementUpdateComponent,
    resolve: {
      loanRequirement: LoanRequirementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loanRequirementRoute)],
  exports: [RouterModule],
})
export class LoanRequirementRoutingModule {}
