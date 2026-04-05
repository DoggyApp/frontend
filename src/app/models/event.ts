import { User } from "./user";
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
  creator?: User;
  trainers: User[];
  dogs: Dog[];
}
