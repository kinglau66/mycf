import dayjs from 'dayjs/esm';

export interface IApplicant {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  createdDt?: dayjs.Dayjs | null;
  salary?: number | null;
}

export type NewApplicant = Omit<IApplicant, 'id'> & { id: null };
