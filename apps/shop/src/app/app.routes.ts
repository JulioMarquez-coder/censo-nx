import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  {
    path: 'products',
    loadComponent: () => import('./estados').then((m) => m.EstadosComponent),
  },

  { path: '**', redirectTo: 'products' },
];
