import { ILoan, NewLoan } from './loan.model';

export const sampleWithRequiredData: ILoan = {
  id: 34544,
};

export const sampleWithPartialData: ILoan = {
  id: 40190,
  amount: 13213,
};

export const sampleWithFullData: ILoan = {
  id: 24434,
  amount: 72568,
  current: 'Shoes mobile Loan',
};

export const sampleWithNewData: NewLoan = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
