import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {

  static mapsReady: Promise<void> = new Promise(resolve => {
    (window as any)['onGoogleMapsReady'] = resolve;
  });

  ngOnInit(): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&v=weekly&callback=onGoogleMapsReady`;
    script.async = true;
    document.head.appendChild(script);
  }

}
