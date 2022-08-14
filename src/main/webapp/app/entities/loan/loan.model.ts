import { ILoanAttribute } from 'app/entities/loan-attribute/loan-attribute.model';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { ILoanRequirement } from 'app/entities/loan-requirement/loan-requirement.model';

export interface ILoan {
  id: number;
  amount?: number | null;
  current?: string | null;
  loanAttribute?: Pick<ILoanAttribute, 'id'> | null;
  applicant?: Pick<IApplicant, 'id'> | null;
  loanRequirement?: Pick<ILoanRequirement, 'id'> | null;
}

export type NewLoan = Omit<ILoan, 'id'> & { id: null };
