import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ApplicantFormService, ApplicantFormGroup } from './applicant-form.service';
import { IApplicant } from '../applicant.model';
import { ApplicantService } from '../service/applicant.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICreditFacility } from 'app/entities/credit-facility/credit-facility.model';
import { CreditFacilityService } from 'app/entities/credit-facility/service/credit-facility.service';

@Component({
  selector: 'jhi-applicant-update',
  templateUrl: './applicant-update.component.html',
})
export class ApplicantUpdateComponent implements OnInit {
  isSaving = false;
  applicant: IApplicant | null = null;

  usersSharedCollection: IUser[] = [];
  creditFacilitiesSharedCollection: ICreditFacility[] = [];

  editForm: ApplicantFormGroup = this.applicantFormService.createApplicantFormGroup();

  constructor(
    protected applicantService: ApplicantService,
    protected applicantFormService: ApplicantFormService,
    protected userService: UserService,
    protected creditFacilityService: CreditFacilityService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCreditFacility = (o1: ICreditFacility | null, o2: ICreditFacility | null): boolean =>
    this.creditFacilityService.compareCreditFacility(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicant }) => {
      this.applicant = applicant;
      if (applicant) {
        this.updateForm(applicant);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const applicant = this.applicantFormService.getApplicant(this.editForm);
    if (applicant.id !== null) {
      this.subscribeToSaveResponse(this.applicantService.update(applicant));
    } else {
      this.subscribeToSaveResponse(this.applicantService.create(applicant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplicant>>): void {
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

  protected updateForm(applicant: IApplicant): void {
    this.applicant = applicant;
    this.applicantFormService.resetForm(this.editForm, applicant);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, applicant.user);
    this.creditFacilitiesSharedCollection = this.creditFacilityService.addCreditFacilityToCollectionIfMissing<ICreditFacility>(
      this.creditFacilitiesSharedCollection,
      applicant.creditFacility
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.applicant?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.creditFacilityService
      .query()
      .pipe(map((res: HttpResponse<ICreditFacility[]>) => res.body ?? []))
      .pipe(
        map((creditFacilities: ICreditFacility[]) =>
          this.creditFacilityService.addCreditFacilityToCollectionIfMissing<ICreditFacility>(
            creditFacilities,
            this.applicant?.creditFacility
          )
        )
      )
      .subscribe((creditFacilities: ICreditFacility[]) => (this.creditFacilitiesSharedCollection = creditFacilities));
  }
}
