import { ILoanAttribute, NewLoanAttribute } from './loan-attribute.model';

export const sampleWithRequiredData: ILoanAttribute = {
  id: 37649,
};

export const sampleWithPartialData: ILoanAttribute = {
  id: 82176,
  jobTitle: 'Direct Paradigm Specialist',
};

export const sampleWithFullData: ILoanAttribute = {
  id: 13933,
  jobTitle: 'Dynamic Applications Administrator',
  minSalary: 57037,
  maxSalary: 50406,
};

export const sampleWithNewData: NewLoanAttribute = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
