import dayjs from 'dayjs/esm';

import { ILoan, NewLoan } from './loan.model';

export const sampleWithRequiredData: ILoan = {
  id: 34544,
};

export const sampleWithPartialData: ILoan = {
  id: 72568,
  amount: 69933,
};

export const sampleWithFullData: ILoan = {
  id: 151,
  amount: 72732,
  currency: 'mobile Loan pink',
  startDate: dayjs('2022-08-13'),
  endDate: dayjs('2022-08-13'),
  interestRate: 8684,
};

export const sampleWithNewData: NewLoan = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
