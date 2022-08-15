import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LoanFormService, LoanFormGroup } from './loan-form.service';
import { ILoan } from '../loan.model';
import { LoanService } from '../service/loan.service';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { ApplicantService } from 'app/entities/applicant/service/applicant.service';
import { ICreditFacility } from 'app/entities/credit-facility/credit-facility.model';
import { CreditFacilityService } from 'app/entities/credit-facility/service/credit-facility.service';

@Component({
  selector: 'jhi-loan-update',
  templateUrl: './loan-update.component.html',
})
export class LoanUpdateComponent implements OnInit {
  isSaving = false;
  loan: ILoan | null = null;

  applicantsSharedCollection: IApplicant[] = [];
  creditFacilitiesSharedCollection: ICreditFacility[] = [];

  editForm: LoanFormGroup = this.loanFormService.createLoanFormGroup();

  constructor(
    protected loanService: LoanService,
    protected loanFormService: LoanFormService,
    protected applicantService: ApplicantService,
    protected creditFacilityService: CreditFacilityService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicant = (o1: IApplicant | null, o2: IApplicant | null): boolean => this.applicantService.compareApplicant(o1, o2);

  compareCreditFacility = (o1: ICreditFacility | null, o2: ICreditFacility | null): boolean =>
    this.creditFacilityService.compareCreditFacility(o1, o2);

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

    this.applicantsSharedCollection = this.applicantService.addApplicantToCollectionIfMissing<IApplicant>(
      this.applicantsSharedCollection,
      loan.applicant
    );
    this.creditFacilitiesSharedCollection = this.creditFacilityService.addCreditFacilityToCollectionIfMissing<ICreditFacility>(
      this.creditFacilitiesSharedCollection,
      loan.creditFacility
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicantService
      .query()
      .pipe(map((res: HttpResponse<IApplicant[]>) => res.body ?? []))
      .pipe(
        map((applicants: IApplicant[]) =>
          this.applicantService.addApplicantToCollectionIfMissing<IApplicant>(applicants, this.loan?.applicant)
        )
      )
      .subscribe((applicants: IApplicant[]) => (this.applicantsSharedCollection = applicants));

    this.creditFacilityService
      .query()
      .pipe(map((res: HttpResponse<ICreditFacility[]>) => res.body ?? []))
      .pipe(
        map((creditFacilities: ICreditFacility[]) =>
          this.creditFacilityService.addCreditFacilityToCollectionIfMissing<ICreditFacility>(creditFacilities, this.loan?.creditFacility)
        )
      )
      .subscribe((creditFacilities: ICreditFacility[]) => (this.creditFacilitiesSharedCollection = creditFacilities));
  }
}
