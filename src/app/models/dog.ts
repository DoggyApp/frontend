import { Alert } from "./alert";
import { Like } from "./like";
import { Note } from "./Note";
import { User } from "./user";

export interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  weight: number;
  notes: Note[];
  image: string;
  likes: Like[]; 
  trainer: User;
  vaccines: []
  alerts: Alert[]
}