import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILoan, NewLoan } from '../loan.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILoan for edit and NewLoanFormGroupInput for create.
 */
type LoanFormGroupInput = ILoan | PartialWithRequiredKeyOf<NewLoan>;

type LoanFormDefaults = Pick<NewLoan, 'id'>;

type LoanFormGroupContent = {
  id: FormControl<ILoan['id'] | NewLoan['id']>;
  amount: FormControl<ILoan['amount']>;
  currency: FormControl<ILoan['currency']>;
  startDate: FormControl<ILoan['startDate']>;
  endDate: FormControl<ILoan['endDate']>;
  interestRate: FormControl<ILoan['interestRate']>;
  applicant: FormControl<ILoan['applicant']>;
};

export type LoanFormGroup = FormGroup<LoanFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LoanFormService {
  createLoanFormGroup(loan: LoanFormGroupInput = { id: null }): LoanFormGroup {
    const loanRawValue = {
      ...this.getFormDefaults(),
      ...loan,
    };
    return new FormGroup<LoanFormGroupContent>({
      id: new FormControl(
        { value: loanRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      amount: new FormControl(loanRawValue.amount),
      currency: new FormControl(loanRawValue.currency ?? 'SGD'),
      startDate: new FormControl(loanRawValue.startDate),
      endDate: new FormControl(loanRawValue.endDate),
      interestRate: new FormControl(loanRawValue.interestRate),
      applicant: new FormControl(loanRawValue.applicant),
    });
  }

  getLoan(form: LoanFormGroup): ILoan | NewLoan {
    return form.getRawValue() as ILoan | NewLoan;
  }

  resetForm(form: LoanFormGroup, loan: LoanFormGroupInput): void {
    const loanRawValue = { ...this.getFormDefaults(), ...loan };
    form.reset(
      {
        ...loanRawValue,
        id: { value: loanRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LoanFormDefaults {
    return {
      id: null,
    };
  }
}
