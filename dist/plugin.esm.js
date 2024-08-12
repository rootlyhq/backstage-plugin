import { createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { RootlyApiRef, RootlyApi } from '@rootly/backstage-plugin-common';

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
          discoveryApi,
          identityApi,
          domain: "https://rootly.com"
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
