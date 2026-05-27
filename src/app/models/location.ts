import { Organization } from "./organization";

export interface Location {
  id: number;
  name: string;
  organization: Organization;
  address: string;
  offsite: boolean;
  latitude?: number | null;
  longitude?: number | null;
}
