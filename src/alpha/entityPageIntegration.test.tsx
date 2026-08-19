/** @jsxRuntime automatic */
import type { Entity } from "@backstage/catalog-model";
import { renderTestApp } from "@backstage/frontend-test-utils";
import { createTestEntityPage } from "@backstage/plugin-catalog-react/testUtils";
import { screen } from "@testing-library/react";

import { rootlyOverviewEntityCard } from "./entityCards";

const entity = (kind: string): Entity => ({
  apiVersion: "backstage.io/v1alpha1",
  kind,
  metadata: { name: "payments" },
});

describe("Rootly entity-card integration", () => {
  it("mounts the real card on a Backstage Component entity page", async () => {
    renderTestApp({
      extensions: [
        createTestEntityPage({ entity: entity("Component") }),
        rootlyOverviewEntityCard,
      ],
    });

    expect(
      await screen.findByText("No Rootly annotations found"),
    ).toBeInTheDocument();
  });

  it("honors the extension filter for non-Component entities", async () => {
    renderTestApp({
      extensions: [
        createTestEntityPage({ entity: entity("System") }),
        rootlyOverviewEntityCard,
      ],
    });

    expect(await screen.findByTestId("empty-entity-page")).toBeInTheDocument();
    expect(
      screen.queryByText("No Rootly annotations found"),
    ).not.toBeInTheDocument();
  });
});
