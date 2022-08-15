import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICreditFacility, NewCreditFacility } from '../credit-facility.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICreditFacility for edit and NewCreditFacilityFormGroupInput for create.
 */
type CreditFacilityFormGroupInput = ICreditFacility | PartialWithRequiredKeyOf<NewCreditFacility>;

type CreditFacilityFormDefaults = Pick<NewCreditFacility, 'id'>;

type CreditFacilityFormGroupContent = {
  id: FormControl<ICreditFacility['id'] | NewCreditFacility['id']>;
  totalLimit: FormControl<ICreditFacility['totalLimit']>;
  currency: FormControl<ICreditFacility['currency']>;
  startDate: FormControl<ICreditFacility['startDate']>;
  endDate: FormControl<ICreditFacility['endDate']>;
};

export type CreditFacilityFormGroup = FormGroup<CreditFacilityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CreditFacilityFormService {
  createCreditFacilityFormGroup(creditFacility: CreditFacilityFormGroupInput = { id: null }): CreditFacilityFormGroup {
    const creditFacilityRawValue = {
      ...this.getFormDefaults(),
      ...creditFacility,
    };
    return new FormGroup<CreditFacilityFormGroupContent>({
      id: new FormControl(
        { value: creditFacilityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      totalLimit: new FormControl(creditFacilityRawValue.totalLimit),
      currency: new FormControl(creditFacilityRawValue.currency),
      startDate: new FormControl(creditFacilityRawValue.startDate),
      endDate: new FormControl(creditFacilityRawValue.endDate),
    });
  }

  getCreditFacility(form: CreditFacilityFormGroup): ICreditFacility | NewCreditFacility {
    return form.getRawValue() as ICreditFacility | NewCreditFacility;
  }

  resetForm(form: CreditFacilityFormGroup, creditFacility: CreditFacilityFormGroupInput): void {
    const creditFacilityRawValue = { ...this.getFormDefaults(), ...creditFacility };
    form.reset(
      {
        ...creditFacilityRawValue,
        id: { value: creditFacilityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CreditFacilityFormDefaults {
    return {
      id: null,
    };
  }
}
