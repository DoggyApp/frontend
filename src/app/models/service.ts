import { Organization } from "./organization";

export interface Service {
  id: number;
  name: string;
  description?: string;
  organization?: Organization;
}
