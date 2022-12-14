import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IApplicant } from '../applicant.model';
import { ApplicantService } from '../service/applicant.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './applicant-delete-dialog.component.html',
})
export class ApplicantDeleteDialogComponent {
  applicant?: IApplicant;

  constructor(protected applicantService: ApplicantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.applicantService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
