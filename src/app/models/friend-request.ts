import { OwnerPublicSearch } from './owner-public';

export interface FriendRequest {
  id: number;
  sender: OwnerPublicSearch;
  receiver: OwnerPublicSearch;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}