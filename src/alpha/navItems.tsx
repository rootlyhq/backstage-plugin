import { convertLegacyRouteRef } from "@backstage/core-compat-api";
import { NavItemBlueprint } from "@backstage/frontend-plugin-api";
import ExtensionsIcon from "@material-ui/icons/Extension";
import { RootlyRouteRef } from "../plugin";

/** @alpha */
export const rootlyNavItem = NavItemBlueprint.make({
  params: {
    routeRef: convertLegacyRouteRef(RootlyRouteRef),
    title: "Rootly",
    icon: ExtensionsIcon,
  },
});
