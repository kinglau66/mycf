import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICreditLimit, NewCreditLimit } from '../credit-limit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICreditLimit for edit and NewCreditLimitFormGroupInput for create.
 */
type CreditLimitFormGroupInput = ICreditLimit | PartialWithRequiredKeyOf<NewCreditLimit>;

type CreditLimitFormDefaults = Pick<NewCreditLimit, 'id'>;

type CreditLimitFormGroupContent = {
  id: FormControl<ICreditLimit['id'] | NewCreditLimit['id']>;
  type: FormControl<ICreditLimit['type']>;
  totalLimit: FormControl<ICreditLimit['totalLimit']>;
  creditFacility: FormControl<ICreditLimit['creditFacility']>;
};

export type CreditLimitFormGroup = FormGroup<CreditLimitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CreditLimitFormService {
  createCreditLimitFormGroup(creditLimit: CreditLimitFormGroupInput = { id: null }): CreditLimitFormGroup {
    const creditLimitRawValue = {
      ...this.getFormDefaults(),
      ...creditLimit,
    };
    return new FormGroup<CreditLimitFormGroupContent>({
      id: new FormControl(
        { value: creditLimitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(creditLimitRawValue.type),
      totalLimit: new FormControl(creditLimitRawValue.totalLimit),
      creditFacility: new FormControl(creditLimitRawValue.creditFacility),
    });
  }

  getCreditLimit(form: CreditLimitFormGroup): ICreditLimit | NewCreditLimit {
    return form.getRawValue() as ICreditLimit | NewCreditLimit;
  }

  resetForm(form: CreditLimitFormGroup, creditLimit: CreditLimitFormGroupInput): void {
    const creditLimitRawValue = { ...this.getFormDefaults(), ...creditLimit };
    form.reset(
      {
        ...creditLimitRawValue,
        id: { value: creditLimitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CreditLimitFormDefaults {
    return {
      id: null,
    };
  }
}
