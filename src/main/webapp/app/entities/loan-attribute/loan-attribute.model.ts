export interface ILoanAttribute {
  id: number;
  jobTitle?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
}

export type NewLoanAttribute = Omit<ILoanAttribute, 'id'> & { id: null };
