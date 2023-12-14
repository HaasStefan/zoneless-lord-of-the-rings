import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('URL', {
  providedIn: 'root',
  factory: () => 'https://lotrapi.co/api/v1',
});
