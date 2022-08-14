import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LoanAttributeComponent } from './list/loan-attribute.component';
import { LoanAttributeDetailComponent } from './detail/loan-attribute-detail.component';
import { LoanAttributeUpdateComponent } from './update/loan-attribute-update.component';
import { LoanAttributeDeleteDialogComponent } from './delete/loan-attribute-delete-dialog.component';
import { LoanAttributeRoutingModule } from './route/loan-attribute-routing.module';

@NgModule({
  imports: [SharedModule, LoanAttributeRoutingModule],
  declarations: [LoanAttributeComponent, LoanAttributeDetailComponent, LoanAttributeUpdateComponent, LoanAttributeDeleteDialogComponent],
})
export class LoanAttributeModule {}
