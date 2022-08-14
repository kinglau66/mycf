import dayjs from 'dayjs/esm';

import { IPayment, NewPayment } from './payment.model';

export const sampleWithRequiredData: IPayment = {
  id: 47537,
};

export const sampleWithPartialData: IPayment = {
  id: 34993,
  paymentAmount: 88670,
  paymentType: 'empower New',
};

export const sampleWithFullData: IPayment = {
  id: 89152,
  paymentAmount: 90810,
  paymentType: 'Buckinghamshire Cotton',
  paymentDate: dayjs('2022-08-13'),
};

export const sampleWithNewData: NewPayment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
