import { Alert } from "./alert";
import { Like } from "./like";
import { Note } from "./Note";
import { Owner } from "./owner";
import { Vaccine } from "./vaccine";

export interface Dog {
  id: number;
  name: string;
  breed: string;
  birthday: string;
  age: string;       // calculated by backend — read only, do not send on create
  weight: number;
  notes: Note[];
  image: string;
  likes: Like[];
  vaccines: Vaccine[];
  alerts: Alert[];
  owner?: Owner;
}