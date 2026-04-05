import { Dog } from "./dog";

export interface Owner {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  dogs: Dog[]
}