import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DogService } from '../services/dog/dog.service';
import { Dog } from '../models/dog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private dogService: DogService
  ) { }

  ngOnInit(): void {
    const dogId = Number(this.route.snapshot.paramMap.get('id'));
    this.dog = this.dogService.getDogById(dogId);
  }

  dog: Dog | null = null;

  //@Input() dog!:Dog;


}
