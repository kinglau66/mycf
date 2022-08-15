import dayjs from 'dayjs/esm';

export interface ICreditFacility {
  id: number;
  totalLimit?: number | null;
  currency?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
}

export type NewCreditFacility = Omit<ICreditFacility, 'id'> & { id: null };
