import { Component, OnInit } from '@angular/core';
import { GooglePlacesService } from './services/google-places/google-places.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {

  constructor(private googlePlacesService: GooglePlacesService) {}

  ngOnInit(): void {
    this.googlePlacesService.preload();
  }

}
