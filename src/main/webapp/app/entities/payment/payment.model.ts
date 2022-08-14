import dayjs from 'dayjs/esm';

export interface IPayment {
  id: number;
  paymentAmount?: number | null;
  paymentType?: string | null;
  paymentDate?: dayjs.Dayjs | null;
}

export type NewPayment = Omit<IPayment, 'id'> & { id: null };
