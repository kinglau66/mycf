import dayjs from 'dayjs/esm';

import { ICreditFacility, NewCreditFacility } from './credit-facility.model';

export const sampleWithRequiredData: ICreditFacility = {
  id: 94323,
};

export const sampleWithPartialData: ICreditFacility = {
  id: 79477,
  currency: 'grow deposit Cambridgeshire',
  startDate: dayjs('2022-08-14'),
};

export const sampleWithFullData: ICreditFacility = {
  id: 13964,
  totalLimit: 61,
  currency: 'Fish',
  startDate: dayjs('2022-08-15'),
  endDate: dayjs('2022-08-14'),
};

export const sampleWithNewData: NewCreditFacility = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
