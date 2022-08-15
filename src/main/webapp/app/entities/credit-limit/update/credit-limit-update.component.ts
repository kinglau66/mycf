import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CreditLimitFormService, CreditLimitFormGroup } from './credit-limit-form.service';
import { ICreditLimit } from '../credit-limit.model';
import { CreditLimitService } from '../service/credit-limit.service';
import { ICreditFacility } from 'app/entities/credit-facility/credit-facility.model';
import { CreditFacilityService } from 'app/entities/credit-facility/service/credit-facility.service';
import { LoanType } from 'app/entities/enumerations/loan-type.model';

@Component({
  selector: 'jhi-credit-limit-update',
  templateUrl: './credit-limit-update.component.html',
})
export class CreditLimitUpdateComponent implements OnInit {
  isSaving = false;
  creditLimit: ICreditLimit | null = null;
  loanTypeValues = Object.keys(LoanType);

  creditFacilitiesSharedCollection: ICreditFacility[] = [];

  editForm: CreditLimitFormGroup = this.creditLimitFormService.createCreditLimitFormGroup();

  constructor(
    protected creditLimitService: CreditLimitService,
    protected creditLimitFormService: CreditLimitFormService,
    protected creditFacilityService: CreditFacilityService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCreditFacility = (o1: ICreditFacility | null, o2: ICreditFacility | null): boolean =>
    this.creditFacilityService.compareCreditFacility(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditLimit }) => {
      this.creditLimit = creditLimit;
      if (creditLimit) {
        this.updateForm(creditLimit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const creditLimit = this.creditLimitFormService.getCreditLimit(this.editForm);
    if (creditLimit.id !== null) {
      this.subscribeToSaveResponse(this.creditLimitService.update(creditLimit));
    } else {
      this.subscribeToSaveResponse(this.creditLimitService.create(creditLimit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreditLimit>>): void {
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

  protected updateForm(creditLimit: ICreditLimit): void {
    this.creditLimit = creditLimit;
    this.creditLimitFormService.resetForm(this.editForm, creditLimit);

    this.creditFacilitiesSharedCollection = this.creditFacilityService.addCreditFacilityToCollectionIfMissing<ICreditFacility>(
      this.creditFacilitiesSharedCollection,
      creditLimit.creditFacility
    );
  }

  protected loadRelationshipsOptions(): void {
    this.creditFacilityService
      .query()
      .pipe(map((res: HttpResponse<ICreditFacility[]>) => res.body ?? []))
      .pipe(
        map((creditFacilities: ICreditFacility[]) =>
          this.creditFacilityService.addCreditFacilityToCollectionIfMissing<ICreditFacility>(
            creditFacilities,
            this.creditLimit?.creditFacility
          )
        )
      )
      .subscribe((creditFacilities: ICreditFacility[]) => (this.creditFacilitiesSharedCollection = creditFacilities));
  }
}
