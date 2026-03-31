import { Dog } from "./dog";
import { User } from "./user";

export interface Organization {
  id: number;
  name: string;
  breed: string;
  Email: string;
  weight: number;
  password: string;
  employees: User[];
  dogs: Dog[]
}