import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ICreditFacility } from 'app/entities/credit-facility/credit-facility.model';

export interface IApplicant {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  createdDt?: dayjs.Dayjs | null;
  salary?: number | null;
  user?: Pick<IUser, 'id'> | null;
  creditFacility?: Pick<ICreditFacility, 'id'> | null;
}

export type NewApplicant = Omit<IApplicant, 'id'> & { id: null };
