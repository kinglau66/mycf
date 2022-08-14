import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoanRequirementFormService, LoanRequirementFormGroup } from './loan-requirement-form.service';
import { ILoanRequirement } from '../loan-requirement.model';
import { LoanRequirementService } from '../service/loan-requirement.service';
import { LoanType } from 'app/entities/enumerations/loan-type.model';

@Component({
  selector: 'jhi-loan-requirement-update',
  templateUrl: './loan-requirement-update.component.html',
})
export class LoanRequirementUpdateComponent implements OnInit {
  isSaving = false;
  loanRequirement: ILoanRequirement | null = null;
  loanTypeValues = Object.keys(LoanType);

  editForm: LoanRequirementFormGroup = this.loanRequirementFormService.createLoanRequirementFormGroup();

  constructor(
    protected loanRequirementService: LoanRequirementService,
    protected loanRequirementFormService: LoanRequirementFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanRequirement }) => {
      this.loanRequirement = loanRequirement;
      if (loanRequirement) {
        this.updateForm(loanRequirement);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loanRequirement = this.loanRequirementFormService.getLoanRequirement(this.editForm);
    if (loanRequirement.id !== null) {
      this.subscribeToSaveResponse(this.loanRequirementService.update(loanRequirement));
    } else {
      this.subscribeToSaveResponse(this.loanRequirementService.create(loanRequirement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoanRequirement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(loanRequirement: ILoanRequirement): void {
    this.loanRequirement = loanRequirement;
    this.loanRequirementFormService.resetForm(this.editForm, loanRequirement);
  }
}
