import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreditFacility } from '../credit-facility.model';
import { CreditFacilityService } from '../service/credit-facility.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './credit-facility-delete-dialog.component.html',
})
export class CreditFacilityDeleteDialogComponent {
  creditFacility?: ICreditFacility;

  constructor(protected creditFacilityService: CreditFacilityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.creditFacilityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
