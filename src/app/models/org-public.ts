import { Service } from './service';
import { Review } from './review';

export interface OrgPublic {
  id: number;
  name: string;
  title?: string;
  services: Service[];
  reviews: Review[];
}