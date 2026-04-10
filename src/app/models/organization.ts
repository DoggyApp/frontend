import { Dog } from "./dog";
import { User } from "./user";
import { Service } from "./service";
import { Review } from "./review";

export interface Organization {
  id: number;
  name: string;
  email: string;
  password?: string; // @JsonIgnore on backend — not present in responses
  title?: string;
  employees: User[];
  dogs: Dog[];
  services?: Service[];
  reviews?: Review[];
  subscriptionStart?: string;
  subscriptionExpiration?: string;
}