import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILoanRequirement } from '../loan-requirement.model';
import { LoanRequirementService } from '../service/loan-requirement.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './loan-requirement-delete-dialog.component.html',
})
export class LoanRequirementDeleteDialogComponent {
  loanRequirement?: ILoanRequirement;

  constructor(protected loanRequirementService: LoanRequirementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.loanRequirementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
