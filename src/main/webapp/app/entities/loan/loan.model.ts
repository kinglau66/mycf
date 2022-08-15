import dayjs from 'dayjs/esm';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { ICreditFacility } from 'app/entities/credit-facility/credit-facility.model';

export interface ILoan {
  id: number;
  amount?: number | null;
  currency?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  interestRate?: number | null;
  applicant?: Pick<IApplicant, 'id'> | null;
  creditFacility?: Pick<ICreditFacility, 'id'> | null;
}

export type NewLoan = Omit<ILoan, 'id'> & { id: null };
