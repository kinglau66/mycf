import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILoanAttribute, NewLoanAttribute } from '../loan-attribute.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILoanAttribute for edit and NewLoanAttributeFormGroupInput for create.
 */
type LoanAttributeFormGroupInput = ILoanAttribute | PartialWithRequiredKeyOf<NewLoanAttribute>;

type LoanAttributeFormDefaults = Pick<NewLoanAttribute, 'id'>;

type LoanAttributeFormGroupContent = {
  id: FormControl<ILoanAttribute['id'] | NewLoanAttribute['id']>;
  jobTitle: FormControl<ILoanAttribute['jobTitle']>;
  minSalary: FormControl<ILoanAttribute['minSalary']>;
  maxSalary: FormControl<ILoanAttribute['maxSalary']>;
};

export type LoanAttributeFormGroup = FormGroup<LoanAttributeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LoanAttributeFormService {
  createLoanAttributeFormGroup(loanAttribute: LoanAttributeFormGroupInput = { id: null }): LoanAttributeFormGroup {
    const loanAttributeRawValue = {
      ...this.getFormDefaults(),
      ...loanAttribute,
    };
    return new FormGroup<LoanAttributeFormGroupContent>({
      id: new FormControl(
        { value: loanAttributeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      jobTitle: new FormControl(loanAttributeRawValue.jobTitle),
      minSalary: new FormControl(loanAttributeRawValue.minSalary),
      maxSalary: new FormControl(loanAttributeRawValue.maxSalary),
    });
  }

  getLoanAttribute(form: LoanAttributeFormGroup): ILoanAttribute | NewLoanAttribute {
    return form.getRawValue() as ILoanAttribute | NewLoanAttribute;
  }

  resetForm(form: LoanAttributeFormGroup, loanAttribute: LoanAttributeFormGroupInput): void {
    const loanAttributeRawValue = { ...this.getFormDefaults(), ...loanAttribute };
    form.reset(
      {
        ...loanAttributeRawValue,
        id: { value: loanAttributeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LoanAttributeFormDefaults {
    return {
      id: null,
    };
  }
}
