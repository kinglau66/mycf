import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LoanComponent } from './list/loan.component';
import { LoanDetailComponent } from './detail/loan-detail.component';
import { LoanUpdateComponent } from './update/loan-update.component';
import { LoanDeleteDialogComponent } from './delete/loan-delete-dialog.component';
import { LoanRoutingModule } from './route/loan-routing.module';

@NgModule({
  imports: [SharedModule, LoanRoutingModule],
  declarations: [LoanComponent, LoanDetailComponent, LoanUpdateComponent, LoanDeleteDialogComponent],
})
export class LoanModule {}
