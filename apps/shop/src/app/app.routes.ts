import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/inicio/inicio').then((m) => m.InicioComponent),
  },
  {
    path: 'estados',
    loadComponent: () =>
      import('./pages/estados/estados').then((m) => m.EstadosComponent),
  },
  {
    path: 'tabla-estados',
    loadComponent: () =>
      import('./pages/tabla-estados/tabla-estados').then((m) => m.TablaEstadosComponent),
    
    },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
