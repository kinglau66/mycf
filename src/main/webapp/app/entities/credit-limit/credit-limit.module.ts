import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditLimitComponent } from './list/credit-limit.component';
import { CreditLimitDetailComponent } from './detail/credit-limit-detail.component';
import { CreditLimitUpdateComponent } from './update/credit-limit-update.component';
import { CreditLimitDeleteDialogComponent } from './delete/credit-limit-delete-dialog.component';
import { CreditLimitRoutingModule } from './route/credit-limit-routing.module';

@NgModule({
  imports: [SharedModule, CreditLimitRoutingModule],
  declarations: [CreditLimitComponent, CreditLimitDetailComponent, CreditLimitUpdateComponent, CreditLimitDeleteDialogComponent],
})
export class CreditLimitModule {}
