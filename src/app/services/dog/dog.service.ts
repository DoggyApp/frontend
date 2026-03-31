import { Injectable } from '@angular/core';
import { Dog } from 'src/app/models/dog';

@Injectable({
  providedIn: 'root'
})
export class DogService {

  constructor() { }

    private dogs: Dog[] = [
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 3,
      weight: 65,
      notes: 'Loves tennis balls',
      image: 'https://placedog.net/500'
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Husky',
      age: 2,
      weight: 50,
      notes: 'Very energetic',
      image: 'https://placedog.net/501'
    }
  ];

  getDogs(): Dog[] {
    return this.dogs;
  }

  getDogById(id: number): Dog | null {
    return this.dogs.find(dog => dog.id === id) ?? null;
  }

}
