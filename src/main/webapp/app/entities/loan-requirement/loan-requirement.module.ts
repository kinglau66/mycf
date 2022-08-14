import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LoanRequirementComponent } from './list/loan-requirement.component';
import { LoanRequirementDetailComponent } from './detail/loan-requirement-detail.component';
import { LoanRequirementUpdateComponent } from './update/loan-requirement-update.component';
import { LoanRequirementDeleteDialogComponent } from './delete/loan-requirement-delete-dialog.component';
import { LoanRequirementRoutingModule } from './route/loan-requirement-routing.module';

@NgModule({
  imports: [SharedModule, LoanRequirementRoutingModule],
  declarations: [
    LoanRequirementComponent,
    LoanRequirementDetailComponent,
    LoanRequirementUpdateComponent,
    LoanRequirementDeleteDialogComponent,
  ],
})
export class LoanRequirementModule {}
