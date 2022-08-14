import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILoanRequirement, NewLoanRequirement } from '../loan-requirement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILoanRequirement for edit and NewLoanRequirementFormGroupInput for create.
 */
type LoanRequirementFormGroupInput = ILoanRequirement | PartialWithRequiredKeyOf<NewLoanRequirement>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILoanRequirement | NewLoanRequirement> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type LoanRequirementFormRawValue = FormValueOf<ILoanRequirement>;

type NewLoanRequirementFormRawValue = FormValueOf<NewLoanRequirement>;

type LoanRequirementFormDefaults = Pick<NewLoanRequirement, 'id' | 'startDate' | 'endDate'>;

type LoanRequirementFormGroupContent = {
  id: FormControl<LoanRequirementFormRawValue['id'] | NewLoanRequirement['id']>;
  totalLimit: FormControl<LoanRequirementFormRawValue['totalLimit']>;
  currency: FormControl<LoanRequirementFormRawValue['currency']>;
  type: FormControl<LoanRequirementFormRawValue['type']>;
  startDate: FormControl<LoanRequirementFormRawValue['startDate']>;
  endDate: FormControl<LoanRequirementFormRawValue['endDate']>;
};

export type LoanRequirementFormGroup = FormGroup<LoanRequirementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LoanRequirementFormService {
  createLoanRequirementFormGroup(loanRequirement: LoanRequirementFormGroupInput = { id: null }): LoanRequirementFormGroup {
    const loanRequirementRawValue = this.convertLoanRequirementToLoanRequirementRawValue({
      ...this.getFormDefaults(),
      ...loanRequirement,
    });
    return new FormGroup<LoanRequirementFormGroupContent>({
      id: new FormControl(
        { value: loanRequirementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      totalLimit: new FormControl(loanRequirementRawValue.totalLimit),
      currency: new FormControl(loanRequirementRawValue.currency),
      type: new FormControl(loanRequirementRawValue.type),
      startDate: new FormControl(loanRequirementRawValue.startDate),
      endDate: new FormControl(loanRequirementRawValue.endDate),
    });
  }

  getLoanRequirement(form: LoanRequirementFormGroup): ILoanRequirement | NewLoanRequirement {
    return this.convertLoanRequirementRawValueToLoanRequirement(
      form.getRawValue() as LoanRequirementFormRawValue | NewLoanRequirementFormRawValue
    );
  }

  resetForm(form: LoanRequirementFormGroup, loanRequirement: LoanRequirementFormGroupInput): void {
    const loanRequirementRawValue = this.convertLoanRequirementToLoanRequirementRawValue({ ...this.getFormDefaults(), ...loanRequirement });
    form.reset(
      {
        ...loanRequirementRawValue,
        id: { value: loanRequirementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LoanRequirementFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertLoanRequirementRawValueToLoanRequirement(
    rawLoanRequirement: LoanRequirementFormRawValue | NewLoanRequirementFormRawValue
  ): ILoanRequirement | NewLoanRequirement {
    return {
      ...rawLoanRequirement,
      startDate: dayjs(rawLoanRequirement.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawLoanRequirement.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertLoanRequirementToLoanRequirementRawValue(
    loanRequirement: ILoanRequirement | (Partial<NewLoanRequirement> & LoanRequirementFormDefaults)
  ): LoanRequirementFormRawValue | PartialWithRequiredKeyOf<NewLoanRequirementFormRawValue> {
    return {
      ...loanRequirement,
      startDate: loanRequirement.startDate ? loanRequirement.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: loanRequirement.endDate ? loanRequirement.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
