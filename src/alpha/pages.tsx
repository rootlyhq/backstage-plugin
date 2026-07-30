import React from "react";
import {
  compatWrapper,
  convertLegacyRouteRef,
} from "@backstage/core-compat-api";
import { PageBlueprint } from "@backstage/frontend-plugin-api";
import ExtensionsIcon from "@material-ui/icons/Extension";
import { RootlyRouteRef } from "../plugin";

/** @alpha */
export const rootlyPage = PageBlueprint.make({
  params: {
    path: "/rootly",
    routeRef: convertLegacyRouteRef(RootlyRouteRef),
    title: "Rootly",
    icon: <ExtensionsIcon />,
    loader: async () =>
      import("../components/RootlyPage").then((m) =>
        compatWrapper(<m.RootlyPage />),
      ),
  },
});
