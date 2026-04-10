import { Dog } from "./dog";

export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  handle: string;
  email: string;
  password?: string;
  phoneNumber: string;
  dogs: Dog[];
  friends?: Owner[];
}