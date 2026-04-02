import { User } from "./user";
import { Dog } from "./dog";

export interface Event {
  id: number;
  event: string;       // event name / title
  description: string;
  startTime: string;   // ISO: "2026-04-06T09:00:00"
  endTime: string;
  place: string;
  creator?: User;
  trainers: User[];
  dogs: Dog[];
}
