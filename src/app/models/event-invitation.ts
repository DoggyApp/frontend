import { OwnerPublicSearch } from './owner-public';
import { CalendarEvent } from './event';

export interface EventInvitation {
  id: number;
  event: CalendarEvent;
  sender: OwnerPublicSearch;
  recipient: OwnerPublicSearch;
  createdAt: string;
}