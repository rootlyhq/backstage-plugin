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

export const EntityRootlyRootlyOverviewCard = RootlyPlugin.provide(
  createComponentExtension({
    name: 'EntityRootlyRootlyOverviewCard',
    component: {
      lazy: () => import('./components/Entity').then(m => m.RootlyOverviewCard),
    },
  }),
);
