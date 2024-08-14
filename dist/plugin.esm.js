import { createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { RootlyApi } from '@rootly/backstage-plugin-common';
import { RootlyApiRef } from './api.esm.js';

const RootlyRouteRef = createRouteRef({
  id: "Rootly"
});
const RootlyPlugin = createPlugin({
  id: "Rootly",
  apis: [
    createApiFactory({
      api: RootlyApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => {
        return new RootlyApi({
          apiProxyPath: discoveryApi.getBaseUrl("proxy"),
          apiToken: identityApi.getCredentials()
        });
      }
    })
  ],
  routes: {
    explore: RootlyRouteRef
  }
});

export { RootlyPlugin, RootlyRouteRef };
//# sourceMappingURL=plugin.esm.js.map
