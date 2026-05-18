import { User } from "./user";
import { Owner } from "./owner";
import { Dog } from "./dog";
import { Room } from "./room";

export interface EventCreator {
  id: number;
  firstName: string;
  lastName: string;
}

export interface CalendarEvent {
  id: number;
  event: string;       // event name / title
  description: string;
  startTime: string;   // ISO: "2026-04-06T09:00:00"
  endTime: string;
  room?: Room;
  address?: string;
  userCreator?: EventCreator;
  ownerCreator?: EventCreator;
  userAttendees: User[];
  ownerAttendees: Owner[];
  dogs: Dog[];
}
