import { Time } from "@angular/common";
import { User } from "./user";
import { Dog } from "./dog";

export interface Event {
  dog: number
  startTime: Date;
  endTime: Date; 
  title: string; 
  place: string;
  description: string;
  trainers: User[]; 
  dogs : Dog[];
}