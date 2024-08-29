import {
  createPlugin,
  createRouteRef,
} from '@backstage/core-plugin-api';

export const RootlyRouteRef = createRouteRef({
  id: 'Rootly',
});

export const RootlyPlugin = createPlugin({
  id: 'Rootly',
  routes: {
    explore: RootlyRouteRef,
  },
});
