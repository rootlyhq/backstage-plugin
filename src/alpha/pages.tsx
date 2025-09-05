import React from "react";
import {
  compatWrapper,
  convertLegacyRouteRef,
} from "@backstage/core-compat-api";
import { PageBlueprint } from "@backstage/frontend-plugin-api";
import { RootlyRouteRef } from "../plugin";

/** @alpha */
export const rootlyPage = PageBlueprint.make({
  params: {
    path: "/rootly",
    routeRef: convertLegacyRouteRef(RootlyRouteRef),
    loader: async () =>
      import("../components/RootlyPage").then((m) =>
        compatWrapper(<m.RootlyPage />),
      ),
  },
});
