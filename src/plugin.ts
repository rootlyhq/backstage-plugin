import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
  identityApiRef
} from '@backstage/core-plugin-api';
import { RootlyApi, RootlyApiRef } from '@rootly/backstage-plugin-common';

export const RootlyRouteRef = createRouteRef({
  id: 'Rootly',
});

export const RootlyPlugin = createPlugin({
  id: 'Rootly',
  apis: [
    createApiFactory({
      api: RootlyApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => {
        return new RootlyApi({
          discoveryApi: discoveryApi,
          identityApi: identityApi,
          domain: 'https://rootly.com',
        });
      },
    }),
  ],
  routes: {
    explore: RootlyRouteRef,
  },
});
