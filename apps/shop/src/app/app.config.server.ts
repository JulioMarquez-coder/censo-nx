import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appRoutes } from './app.routes';

export const appConfigServer: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
  ],
};
