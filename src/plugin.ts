import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
  identityApiRef
} from '@backstage/core-plugin-api';
import { RootlyApi } from '@rootly/backstage-plugin-common';
import { RootlyApiRef } from './api';

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
          apiProxyPath:`${discoveryApi.getBaseUrl('proxy')}/rootly/api`,
          apiToken: identityApi.getCredentials(),
          domain: 'https://rootly.com',
        });
      },
    }),
  ],
  routes: {
    explore: RootlyRouteRef,
  },
});
