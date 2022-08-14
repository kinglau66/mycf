import dayjs from 'dayjs/esm';
import { LoanType } from 'app/entities/enumerations/loan-type.model';

export interface ILoanRequirement {
  id: number;
  totalLimit?: number | null;
  currency?: string | null;
  type?: LoanType | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
}

export type NewLoanRequirement = Omit<ILoanRequirement, 'id'> & { id: null };
