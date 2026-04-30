import { DogPublic } from './dog-public';
import { OrgPublic } from './org-public';
import { OwnerPublicSearch } from './owner-public';

export interface RegistrationRequest {
  id: number;
  owner: OwnerPublicSearch;
  dog: DogPublic;
  organization: OrgPublic;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}
