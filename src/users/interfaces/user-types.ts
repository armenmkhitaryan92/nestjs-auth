import { UserRole } from '../enums/user-role.enum';

export interface ReturnAddress {
  street: string | null;
  suite: string | null;
  city: string | null;
  zipcode: string | null;
  geo: {
    lat: string | null;
    lng: string | null;
  };
}

export interface ReturnUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  website: string | null;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  address: ReturnAddress | null;
  createdAt: Date;
}
