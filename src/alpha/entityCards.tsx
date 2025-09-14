import React from "react";
import { compatWrapper } from "@backstage/core-compat-api";
import { EntityCardBlueprint } from "@backstage/plugin-catalog-react/alpha";

/** @alpha */
export const rootlyOverviewEntityCard = EntityCardBlueprint.make({
  params: {
    filter: "kind:component",
    loader: async () =>
      import("../components/Entity").then((m) =>
        compatWrapper(<m.RootlyOverviewCard />)
      ),
  },
});
