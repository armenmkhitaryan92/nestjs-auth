import { UserRole } from '../enums/user-role.enum';

export interface ReturnAddress {
  street: string | null;
  suite: string | null;
  city: string | null;
  zipcode: string | null;
  lat: string | null;
  lng: string | null;
}

export interface ReturnCompany {
  name: string | null;
  catchPhrase: string | null;
  bs: string | null;
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
  company: ReturnCompany | null;
  createdAt: Date;
}

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string | null;
  website?: string | null;

  address?: {
    street: string | null;
    suite: string | null;
    city: string | null;
    zipcode: string | null;
    lat: string | null;
    lng: string | null;
  } | null;

  company?: {
    name: string | null;
    catchPhrase: string | null;
    bs: string | null;
  } | null;
};
