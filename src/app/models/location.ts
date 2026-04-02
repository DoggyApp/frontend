import { Organization } from "./organization";

export interface Location {
  id: number;
  name: string;
  organization: Organization;
}
