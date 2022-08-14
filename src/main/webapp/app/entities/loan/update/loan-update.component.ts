import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LoanFormService, LoanFormGroup } from './loan-form.service';
import { ILoan } from '../loan.model';
import { LoanService } from '../service/loan.service';
import { ILoanAttribute } from 'app/entities/loan-attribute/loan-attribute.model';
import { LoanAttributeService } from 'app/entities/loan-attribute/service/loan-attribute.service';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { ApplicantService } from 'app/entities/applicant/service/applicant.service';
import { ILoanRequirement } from 'app/entities/loan-requirement/loan-requirement.model';
import { LoanRequirementService } from 'app/entities/loan-requirement/service/loan-requirement.service';

@Component({
  selector: 'jhi-loan-update',
  templateUrl: './loan-update.component.html',
})
export class LoanUpdateComponent implements OnInit {
  isSaving = false;
  loan: ILoan | null = null;

  loanAttributesSharedCollection: ILoanAttribute[] = [];
  applicantsSharedCollection: IApplicant[] = [];
  loanRequirementsSharedCollection: ILoanRequirement[] = [];

  editForm: LoanFormGroup = this.loanFormService.createLoanFormGroup();

  constructor(
    protected loanService: LoanService,
    protected loanFormService: LoanFormService,
    protected loanAttributeService: LoanAttributeService,
    protected applicantService: ApplicantService,
    protected loanRequirementService: LoanRequirementService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLoanAttribute = (o1: ILoanAttribute | null, o2: ILoanAttribute | null): boolean =>
    this.loanAttributeService.compareLoanAttribute(o1, o2);

  compareApplicant = (o1: IApplicant | null, o2: IApplicant | null): boolean => this.applicantService.compareApplicant(o1, o2);

  compareLoanRequirement = (o1: ILoanRequirement | null, o2: ILoanRequirement | null): boolean =>
    this.loanRequirementService.compareLoanRequirement(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loan }) => {
      this.loan = loan;
      if (loan) {
        this.updateForm(loan);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const loan = this.loanFormService.getLoan(this.editForm);
    if (loan.id !== null) {
      this.subscribeToSaveResponse(this.loanService.update(loan));
    } else {
      this.subscribeToSaveResponse(this.loanService.create(loan));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILoan>>): void {
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

  protected updateForm(loan: ILoan): void {
    this.loan = loan;
    this.loanFormService.resetForm(this.editForm, loan);

    this.loanAttributesSharedCollection = this.loanAttributeService.addLoanAttributeToCollectionIfMissing<ILoanAttribute>(
      this.loanAttributesSharedCollection,
      loan.loanAttribute
    );
    this.applicantsSharedCollection = this.applicantService.addApplicantToCollectionIfMissing<IApplicant>(
      this.applicantsSharedCollection,
      loan.applicant
    );
    this.loanRequirementsSharedCollection = this.loanRequirementService.addLoanRequirementToCollectionIfMissing<ILoanRequirement>(
      this.loanRequirementsSharedCollection,
      loan.loanRequirement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.loanAttributeService
      .query()
      .pipe(map((res: HttpResponse<ILoanAttribute[]>) => res.body ?? []))
      .pipe(
        map((loanAttributes: ILoanAttribute[]) =>
          this.loanAttributeService.addLoanAttributeToCollectionIfMissing<ILoanAttribute>(loanAttributes, this.loan?.loanAttribute)
        )
      )
      .subscribe((loanAttributes: ILoanAttribute[]) => (this.loanAttributesSharedCollection = loanAttributes));

    this.applicantService
      .query()
      .pipe(map((res: HttpResponse<IApplicant[]>) => res.body ?? []))
      .pipe(
        map((applicants: IApplicant[]) =>
          this.applicantService.addApplicantToCollectionIfMissing<IApplicant>(applicants, this.loan?.applicant)
        )
      )
      .subscribe((applicants: IApplicant[]) => (this.applicantsSharedCollection = applicants));

    this.loanRequirementService
      .query()
      .pipe(map((res: HttpResponse<ILoanRequirement[]>) => res.body ?? []))
      .pipe(
        map((loanRequirements: ILoanRequirement[]) =>
          this.loanRequirementService.addLoanRequirementToCollectionIfMissing<ILoanRequirement>(
            loanRequirements,
            this.loan?.loanRequirement
          )
        )
      )
      .subscribe((loanRequirements: ILoanRequirement[]) => (this.loanRequirementsSharedCollection = loanRequirements));
  }
}
