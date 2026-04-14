import { Alert } from './alert';
import { Like } from './like';
import { Note } from './Note';

export interface DogPublic {
  id: number;
  name: string;
  breed: string;
  age: number;
  weight: number;
  image: string;
  alerts: Alert[];
  likes: Like[];
  notes: Note[];
}
