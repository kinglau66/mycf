import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoanAttributeFormService, LoanAttributeFormGroup } from './loan-attribute-form.service';
import { ILoanAttribute } from '../loan-attribute.model';
import { LoanAttributeService } from '../service/loan-attribute.service';

@Component({
  selector: 'jhi-loan-attribute-update',
  templateUrl: './loan-attribute-update.component.html',
})
export class LoanAttributeUpdateComponent implements OnInit {
  isSaving = false;
  loanAttribute: ILoanAttribute | null = null;

  editForm: LoanAttributeFormGroup = this.loanAttributeFormService.createLoanAttributeFormGroup();

  constructor(
    protected loanAttributeService: LoanAttributeService,
    protected loanAttributeFormService: LoanAttributeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanAttribute }) => {
      this.loanAttribute = loanAttribute;
      if (loanAttribute) {
        this.updateForm(loanAttribute);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loanAttribute = this.loanAttributeFormService.getLoanAttribute(this.editForm);
    if (loanAttribute.id !== null) {
      this.subscribeToSaveResponse(this.loanAttributeService.update(loanAttribute));
    } else {
      this.subscribeToSaveResponse(this.loanAttributeService.create(loanAttribute));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoanAttribute>>): void {
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

  protected updateForm(loanAttribute: ILoanAttribute): void {
    this.loanAttribute = loanAttribute;
    this.loanAttributeFormService.resetForm(this.editForm, loanAttribute);
  }
}
