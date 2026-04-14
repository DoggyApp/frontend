import { Organization } from "./organization";

export interface Service {
  id: number;
  name: string;
  organization?: Organization;
}
