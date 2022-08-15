import { LoanType } from 'app/entities/enumerations/loan-type.model';

import { ICreditLimit, NewCreditLimit } from './credit-limit.model';

export const sampleWithRequiredData: ICreditLimit = {
  id: 8353,
};

export const sampleWithPartialData: ICreditLimit = {
  id: 57094,
  totalLimit: 84782,
};

export const sampleWithFullData: ICreditLimit = {
  id: 51355,
  type: LoanType['CAR'],
  totalLimit: 89140,
};

export const sampleWithNewData: NewCreditLimit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
