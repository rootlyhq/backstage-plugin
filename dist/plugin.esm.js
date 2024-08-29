import { createRouteRef, createPlugin } from '@backstage/core-plugin-api';

const RootlyRouteRef = createRouteRef({
  id: "Rootly"
});
const RootlyPlugin = createPlugin({
  id: "Rootly",
  routes: {
    explore: RootlyRouteRef
  }
});

export { RootlyPlugin, RootlyRouteRef };
//# sourceMappingURL=plugin.esm.js.map
