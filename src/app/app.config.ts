import { ApplicationConfig, NgZone, ɵNoopNgZone } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NgZone, useClass: ɵNoopNgZone },
    provideHttpClient(),
  ],
};

