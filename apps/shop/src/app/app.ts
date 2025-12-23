import { Component } from '@angular/core';
import { EstadosComponent } from './estados';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EstadosComponent],
  template: `<app-estados></app-estados>`,
})
export class AppComponent {}
