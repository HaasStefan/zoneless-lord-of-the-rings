import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'character',
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./characters/character/character.component').then(
            (m) => m.CharacterComponent
          ),
      },
    ],
  },
];
