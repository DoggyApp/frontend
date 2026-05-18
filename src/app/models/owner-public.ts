import { DogPublic } from './dog-public';
import { OrgPublic } from './org-public';

// Search result — firstName, lastName, handle only.
export interface OwnerPublicSearch {
  firstName: string;
  lastName: string;
  handle: string;
}

// Client search result from UserService — id-based, no handle.
export interface OwnerSearchResult {
  id: number;
  firstName: string;
  lastName: string;
}

// Friend view — adds dogs (with alerts/likes/notes), friends (shallow), and favorite orgs.
export interface OwnerPublicFriend extends OwnerPublicSearch {
  dogs: DogPublic[];
  friends: OwnerPublicSearch[];
  favoriteOrganizations: OrgPublic[];
}