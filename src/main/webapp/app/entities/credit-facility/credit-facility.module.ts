import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditFacilityComponent } from './list/credit-facility.component';
import { CreditFacilityDetailComponent } from './detail/credit-facility-detail.component';
import { CreditFacilityUpdateComponent } from './update/credit-facility-update.component';
import { CreditFacilityDeleteDialogComponent } from './delete/credit-facility-delete-dialog.component';
import { CreditFacilityRoutingModule } from './route/credit-facility-routing.module';

@NgModule({
  imports: [SharedModule, CreditFacilityRoutingModule],
  declarations: [
    CreditFacilityComponent,
    CreditFacilityDetailComponent,
    CreditFacilityUpdateComponent,
    CreditFacilityDeleteDialogComponent,
  ],
})
export class CreditFacilityModule {}
