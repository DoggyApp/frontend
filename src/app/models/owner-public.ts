import { DogPublic } from './dog-public';
import { OrgPublic } from './org-public';

// Search result — firstName, lastName, handle only.
export interface OwnerPublicSearch {
  firstName: string;
  lastName: string;
  handle: string;
}

// Friend view — adds dogs (with alerts/likes/notes), friends (shallow), and favorite orgs.
export interface OwnerPublicFriend extends OwnerPublicSearch {
  dogs: DogPublic[];
  friends: OwnerPublicSearch[];
  favoriteOrganizations: OrgPublic[];
}