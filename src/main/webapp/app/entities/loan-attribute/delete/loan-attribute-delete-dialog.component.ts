import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILoanAttribute } from '../loan-attribute.model';
import { LoanAttributeService } from '../service/loan-attribute.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './loan-attribute-delete-dialog.component.html',
})
export class LoanAttributeDeleteDialogComponent {
  loanAttribute?: ILoanAttribute;

  constructor(protected loanAttributeService: LoanAttributeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.loanAttributeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
