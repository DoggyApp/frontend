import { Dog } from "./dog";
import { Organization } from "./organization";

export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  handle: string;
  email: string;
  password?: string;
  phoneNumber: string;
  address?: string;
  birthday?: string;
  dogs: Dog[];
  friends?: Owner[];
  favoriteOrganizations?: Organization[];
}