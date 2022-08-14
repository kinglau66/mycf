import dayjs from 'dayjs/esm';

import { LoanType } from 'app/entities/enumerations/loan-type.model';

import { ILoanRequirement, NewLoanRequirement } from './loan-requirement.model';

export const sampleWithRequiredData: ILoanRequirement = {
  id: 89241,
};

export const sampleWithPartialData: ILoanRequirement = {
  id: 72306,
  totalLimit: 52138,
  currency: 'parsing bricks-and-clicks',
  startDate: dayjs('2022-08-13T16:12'),
};

export const sampleWithFullData: ILoanRequirement = {
  id: 30947,
  totalLimit: 72836,
  currency: 'transmit Riel',
  type: LoanType['CAR'],
  startDate: dayjs('2022-08-14T04:26'),
  endDate: dayjs('2022-08-13T07:24'),
};

export const sampleWithNewData: NewLoanRequirement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
