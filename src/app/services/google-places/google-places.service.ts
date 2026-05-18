import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GooglePlacesService {

  private scriptPromise: Promise<void> | null = null;

  constructor(private ngZone: NgZone) {}

  /** Kicks off script loading early (call once at app startup). */
  preload(): void { this.loadScript(); }

  /** Resolves when the Google Maps API is fully ready. */
  whenReady(): Promise<void> { return this.loadScript(); }

  private loadScript(): Promise<void> {
    if (this.scriptPromise) return this.scriptPromise;
    if (!environment.googleMapsApiKey) return Promise.resolve();

    this.scriptPromise = new Promise<void>((resolve, reject) => {
      (window as any)['__googleMapsReady'] = resolve;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&v=weekly&libraries=places&callback=__googleMapsReady`;
      script.async = true;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return this.scriptPromise;
  }

  /**
   * Appends a PlaceAutocompleteElement web component to a container div.
   * Calls onSelect with the formatted address string when a place is chosen.
   * Returns the element so the caller can remove it if needed.
   */
  async attachPlaceElement(
    container: HTMLDivElement,
    onSelect: (address: string) => void,
    options: { includedRegionCodes?: string[] } = {}
  ): Promise<any> {
    if (!environment.googleMapsApiKey) return null;
    await this.loadScript();
    const { PlaceAutocompleteElement } = await (window as any).google.maps.importLibrary('places') as any;
    const el = new PlaceAutocompleteElement({
      types: ['address'],
      ...(options.includedRegionCodes ? { includedRegionCodes: options.includedRegionCodes } : {})
    });
    container.innerHTML = '';
    container.appendChild(el);
    const handler = () => {
      this.ngZone.run(() => onSelect((el as any).value ?? ''));
    };
    el.addEventListener('gmp-placeselect', handler);
    el.addEventListener('gmp-select', handler);
    return el;
  }

  /**
   * Like attachPlaceElement but also resolves coordinates via fetchFields
   * with a Geocoder fallback. Calls onSelect with address, lat, and lng.
   */
  async attachPlaceElementWithCoords(
    container: HTMLDivElement,
    onSelect: (address: string, lat: number | null, lng: number | null) => void,
    options: { includedRegionCodes?: string[] } = {}
  ): Promise<any> {
    if (!environment.googleMapsApiKey) return null;
    await this.loadScript();
    const { PlaceAutocompleteElement } = await (window as any).google.maps.importLibrary('places') as any;
    const el = new PlaceAutocompleteElement({
      types: ['address'],
      ...(options.includedRegionCodes ? { includedRegionCodes: options.includedRegionCodes } : {})
    });
    container.innerHTML = '';
    container.appendChild(el);

    const handler = async (event: any) => {
      const place = event.place ?? event.detail?.place;
      const rawAddress = (el as any).value ?? '';
      let resolvedAddress = rawAddress;
      let lat: number | null = null;
      let lng: number | null = null;

      if (place) {
        try {
          await place.fetchFields({ fields: ['formattedAddress', 'location'] });
          resolvedAddress = place.formattedAddress ?? rawAddress;
          lat = place.location?.lat() ?? null;
          lng = place.location?.lng() ?? null;
        } catch { /* fall through to geocoder */ }
      }

      if (lat === null || lng === null) {
        try {
          const coords = await this.geocode(resolvedAddress);
          lat = coords.lat;
          lng = coords.lng;
        } catch { /* coords stay null */ }
      }

      this.ngZone.run(() => onSelect(resolvedAddress, lat, lng));
    };

    el.addEventListener('gmp-placeselect', handler);
    el.addEventListener('gmp-select', handler);
    return el;
  }

  /** Geocodes an address string to lat/lng coordinates. */
  async geocode(address: string): Promise<{ lat: number; lng: number }> {
    await this.loadScript();
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          resolve({
            lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
            lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }
}
