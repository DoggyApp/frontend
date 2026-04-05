import { Dog } from "./dog";
import { User } from "./user";

export interface Organization {
  id: number;
  name: string;
  email: string;
  password?: string; // @JsonIgnore on backend — not present in responses
  employees: User[];
  dogs: Dog[];
  subscriptionStart?: string;
  subscriptionExpiration?: string;
}