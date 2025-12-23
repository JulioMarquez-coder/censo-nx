/* eslint-disable @typescript-eslint/no-explicit-any */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfigServer } from './app/app.config.server';

export default function bootstrap(context: any) {
  return bootstrapApplication(AppComponent, appConfigServer, context);
}
