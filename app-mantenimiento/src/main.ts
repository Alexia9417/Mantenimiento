import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

//inicializa la aplicacion angular
bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));

