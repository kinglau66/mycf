import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CreditFacilityFormService, CreditFacilityFormGroup } from './credit-facility-form.service';
import { ICreditFacility } from '../credit-facility.model';
import { CreditFacilityService } from '../service/credit-facility.service';

@Component({
  selector: 'jhi-credit-facility-update',
  templateUrl: './credit-facility-update.component.html',
})
export class CreditFacilityUpdateComponent implements OnInit {
  isSaving = false;
  creditFacility: ICreditFacility | null = null;

  editForm: CreditFacilityFormGroup = this.creditFacilityFormService.createCreditFacilityFormGroup();

  constructor(
    protected creditFacilityService: CreditFacilityService,
    protected creditFacilityFormService: CreditFacilityFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditFacility }) => {
      this.creditFacility = creditFacility;
      if (creditFacility) {
        this.updateForm(creditFacility);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const creditFacility = this.creditFacilityFormService.getCreditFacility(this.editForm);
    if (creditFacility.id !== null) {
      this.subscribeToSaveResponse(this.creditFacilityService.update(creditFacility));
    } else {
      this.subscribeToSaveResponse(this.creditFacilityService.create(creditFacility));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreditFacility>>): void {
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

  protected updateForm(creditFacility: ICreditFacility): void {
    this.creditFacility = creditFacility;
    this.creditFacilityFormService.resetForm(this.editForm, creditFacility);
  }
}
