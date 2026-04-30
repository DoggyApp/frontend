import { User } from "./user";
import { Owner } from "./owner";
import { Dog } from "./dog";
import { Location } from "./location";

export interface CalendarEvent {
  id: number;
  event: string;       // event name / title
  description: string;
  startTime: string;   // ISO: "2026-04-06T09:00:00"
  endTime: string;
  location?: Location;
  address?: string;
  creator?: User;        // set when an org User created the event
  ownerCreator?: Owner;  // set when an Owner created the event
  attendees: User[];
  ownerAttendees: Owner[];
  dogs: Dog[];
}
