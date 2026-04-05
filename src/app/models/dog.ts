import { Alert } from "./alert";
import { Like } from "./like";
import { Note } from "./Note";
import { Owner } from "./owner";
import { User } from "./user";
import { Vaccine } from "./vaccine";

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
  vaccines: Vaccine[];
  alerts: Alert[];
  owner?: Owner;
}