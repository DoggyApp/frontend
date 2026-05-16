import { User } from "./user";
import { Owner } from "./owner";
import { Dog } from "./dog";
import { Room } from "./room";

export interface CalendarEvent {
  id: number;
  event: string;       // event name / title
  description: string;
  startTime: string;   // ISO: "2026-04-06T09:00:00"
  endTime: string;
  room?: Room;
  address?: string;
  userCreator?: User;    // set when a User created the event
  ownerCreator?: Owner;  // set when an Owner created the event
  attendees: User[];
  ownerAttendees: Owner[];
  dogs: Dog[];
}
