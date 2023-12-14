import { ApplicationConfig, NgZone, ɵNoopNgZone } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NgZone, useClass: ɵNoopNgZone },
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
  ],
};
