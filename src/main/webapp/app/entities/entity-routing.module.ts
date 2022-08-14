import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'applicant',
        data: { pageTitle: 'Applicants' },
        loadChildren: () => import('./applicant/applicant.module').then(m => m.ApplicantModule),
      },
      {
        path: 'loan-requirement',
        data: { pageTitle: 'LoanRequirements' },
        loadChildren: () => import('./loan-requirement/loan-requirement.module').then(m => m.LoanRequirementModule),
      },
      {
        path: 'loan',
        data: { pageTitle: 'Loans' },
        loadChildren: () => import('./loan/loan.module').then(m => m.LoanModule),
      },
      {
        path: 'loan-attribute',
        data: { pageTitle: 'LoanAttributes' },
        loadChildren: () => import('./loan-attribute/loan-attribute.module').then(m => m.LoanAttributeModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'Payments' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
