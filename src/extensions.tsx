import { RootlyPlugin, RootlyRouteRef } from './plugin';
import {
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

export const RootlyPage = RootlyPlugin.provide(
  createRoutableExtension({
    name: 'RootlyPage',
    component: () => import('./components/RootlyPage').then(m => m.RootlyPage),
    mountPoint: RootlyRouteRef,
  }),
);

export const RootlyOverviewCard = RootlyPlugin.provide(
  createComponentExtension({
    name: 'RootlyOverviewCard',
    component: {
      lazy: () => import('./components/Entity').then(m => m.RootlyOverviewCard),
    },
  }),
);

export const RootlyIncidentsPage = RootlyPlugin.provide(
  createComponentExtension({
    name: 'RootlyIncidentsPage',
    component: {
      lazy: () => import('./components/RootlyIncidentsPage').then(m => m.RootlyIncidentsPage),
    },
  }),
);
