import { RootlyPlugin, RootlyRouteRef } from './plugin.esm.js';
import { createRoutableExtension, createComponentExtension } from '@backstage/core-plugin-api';

const RootlyPage = RootlyPlugin.provide(
  createRoutableExtension({
    name: "RootlyPage",
    component: () => import('./components/RootlyPage/index.esm.js').then((m) => m.RootlyPage),
    mountPoint: RootlyRouteRef
  })
);
const RootlyOverviewCard = RootlyPlugin.provide(
  createComponentExtension({
    name: "RootlyOverviewCard",
    component: {
      lazy: () => import('./components/Entity/index.esm.js').then((m) => m.RootlyOverviewCard)
    }
  })
);
const RootlyIncidentsPage = RootlyPlugin.provide(
  createComponentExtension({
    name: "RootlyIncidentsPage",
    component: {
      lazy: () => import('./components/RootlyIncidentsPage/index.esm.js').then((m) => m.RootlyIncidentsPage)
    }
  })
);

export { RootlyIncidentsPage, RootlyOverviewCard, RootlyPage };
//# sourceMappingURL=extensions.esm.js.map
