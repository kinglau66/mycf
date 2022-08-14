import dayjs from 'dayjs/esm';

import { IApplicant, NewApplicant } from './applicant.model';

export const sampleWithRequiredData: IApplicant = {
  id: 57478,
};

export const sampleWithPartialData: IApplicant = {
  id: 1901,
  lastName: 'Feeney',
  createdDt: dayjs('2022-08-13'),
  salary: 9197,
};

export const sampleWithFullData: IApplicant = {
  id: 67885,
  firstName: 'Jo',
  lastName: 'Quitzon',
  email: 'Silas58@gmail.com',
  phoneNumber: 'Oklahoma Grocery deposit',
  createdDt: dayjs('2022-08-13'),
  salary: 28710,
};

export const sampleWithNewData: NewApplicant = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
