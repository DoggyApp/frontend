import { Dog } from "./dog";

export interface Owner {
  id: number;
  name: string;
  Email: string;
  phoneNumber: string;
  dogs: Dog[]
}