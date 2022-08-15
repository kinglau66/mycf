import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IApplicant, NewApplicant } from '../applicant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApplicant for edit and NewApplicantFormGroupInput for create.
 */
type ApplicantFormGroupInput = IApplicant | PartialWithRequiredKeyOf<NewApplicant>;

type ApplicantFormDefaults = Pick<NewApplicant, 'id'>;

type ApplicantFormGroupContent = {
  id: FormControl<IApplicant['id'] | NewApplicant['id']>;
  firstName: FormControl<IApplicant['firstName']>;
  lastName: FormControl<IApplicant['lastName']>;
  email: FormControl<IApplicant['email']>;
  phoneNumber: FormControl<IApplicant['phoneNumber']>;
  createdDt: FormControl<IApplicant['createdDt']>;
  salary: FormControl<IApplicant['salary']>;
  user: FormControl<IApplicant['user']>;
  creditFacility: FormControl<IApplicant['creditFacility']>;
};

export type ApplicantFormGroup = FormGroup<ApplicantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApplicantFormService {
  createApplicantFormGroup(applicant: ApplicantFormGroupInput = { id: null }): ApplicantFormGroup {
    const applicantRawValue = {
      ...this.getFormDefaults(),
      ...applicant,
    };
    return new FormGroup<ApplicantFormGroupContent>({
      id: new FormControl(
        { value: applicantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(applicantRawValue.firstName),
      lastName: new FormControl(applicantRawValue.lastName),
      email: new FormControl(applicantRawValue.email),
      phoneNumber: new FormControl(applicantRawValue.phoneNumber),
      createdDt: new FormControl(applicantRawValue.createdDt),
      salary: new FormControl(applicantRawValue.salary),
      user: new FormControl(applicantRawValue.user),
      creditFacility: new FormControl(applicantRawValue.creditFacility),
    });
  }

  getApplicant(form: ApplicantFormGroup): IApplicant | NewApplicant {
    return form.getRawValue() as IApplicant | NewApplicant;
  }

  resetForm(form: ApplicantFormGroup, applicant: ApplicantFormGroupInput): void {
    const applicantRawValue = { ...this.getFormDefaults(), ...applicant };
    form.reset(
      {
        ...applicantRawValue,
        id: { value: applicantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ApplicantFormDefaults {
    return {
      id: null,
    };
  }
}
