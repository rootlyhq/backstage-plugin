import { convertLegacyRouteRefs } from "@backstage/core-compat-api";
import { createFrontendPlugin } from "@backstage/frontend-plugin-api";

import { RootlyRouteRef } from "../plugin";

import { rootlyApi } from "./apis";
import { rootlyPage } from "./pages";
import { rootlyNavItem } from "./navItems";
import { rootlyOverviewEntityCard } from "./entityCards";
import { rootlyIncidentsEntityContent } from "./entityContents";

/** @alpha */
export const rootlyPlugin = createFrontendPlugin({
  pluginId: "rootly",
  info: { packageJson: () => import("../../package.json") },
  routes: convertLegacyRouteRefs({
    explore: RootlyRouteRef,
  }),
  extensions: [
    rootlyApi,
    rootlyPage,
    rootlyNavItem,
    rootlyOverviewEntityCard,
    rootlyIncidentsEntityContent,
  ],
});
