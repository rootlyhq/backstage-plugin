import React from "react";
import { compatWrapper } from "@backstage/core-compat-api";
import { EntityContentBlueprint } from "@backstage/plugin-catalog-react/alpha";

/** @alpha */
export const rootlyIncidentsEntityContent = EntityContentBlueprint.make({
  params: {
    path: "/rootly",
    title: "Rootly",
    loader: async () =>
      import("../components/RootlyIncidentsPage").then((m) =>
        compatWrapper(<m.RootlyIncidentsPage />)
      ),
  },
});
