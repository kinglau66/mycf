import dayjs from 'dayjs/esm';
import { ILoan } from 'app/entities/loan/loan.model';

export interface IPayment {
  id: number;
  paymentAmount?: number | null;
  paymentType?: string | null;
  paymentDate?: dayjs.Dayjs | null;
  loan?: Pick<ILoan, 'id'> | null;
}

export type NewPayment = Omit<IPayment, 'id'> & { id: null };
