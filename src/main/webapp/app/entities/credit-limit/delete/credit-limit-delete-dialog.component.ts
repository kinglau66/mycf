import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreditLimit } from '../credit-limit.model';
import { CreditLimitService } from '../service/credit-limit.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './credit-limit-delete-dialog.component.html',
})
export class CreditLimitDeleteDialogComponent {
  creditLimit?: ICreditLimit;

  constructor(protected creditLimitService: CreditLimitService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.creditLimitService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
