/** @jsxRuntime automatic */
import type { Entity } from "@backstage/catalog-model";
import {
  createExtensionTester,
  renderInTestApp,
} from "@backstage/frontend-test-utils";
import { EntityCardBlueprint } from "@backstage/plugin-catalog-react/alpha";
import { screen } from "@testing-library/react";

import { rootlyOverviewEntityCard } from "./entityCards";
import { rootlyIncidentsEntityContent } from "./entityContents";
import { rootlyPage } from "./pages";

jest.mock("../components/Entity", () => ({
  RootlyOverviewCard: () => <div>Rootly overview extension</div>,
}));
jest.mock("../components/RootlyIncidentsPage", () => ({
  RootlyIncidentsPage: () => <div>Rootly incidents extension</div>,
}));
jest.mock("../components/RootlyPage", () => ({
  RootlyPage: () => <div>Rootly page extension</div>,
}));

const entity = (kind: string): Entity => ({
  apiVersion: "backstage.io/v1alpha1",
  kind,
  metadata: { name: "example" },
});

describe("alpha frontend extensions", () => {
  it("loads the Rootly page extension", async () => {
    renderInTestApp(createExtensionTester(rootlyPage).reactElement());

    expect(
      await screen.findByText("Rootly page extension"),
    ).toBeInTheDocument();
  });

  it("loads the overview-card extension", async () => {
    renderInTestApp(
      createExtensionTester(rootlyOverviewEntityCard).reactElement(),
    );

    expect(
      await screen.findByText("Rootly overview extension"),
    ).toBeInTheDocument();
  });

  it("filters the overview card to Component entities", () => {
    const filter = createExtensionTester(rootlyOverviewEntityCard).get(
      EntityCardBlueprint.dataRefs.filterFunction,
    );

    expect(filter?.(entity("Component"))).toBe(true);
    expect(filter?.(entity("component"))).toBe(true);
    expect(filter?.(entity("System"))).toBe(false);
  });

  it("loads the incidents entity-content extension", async () => {
    renderInTestApp(
      createExtensionTester(rootlyIncidentsEntityContent).reactElement(),
    );

    expect(
      await screen.findByText("Rootly incidents extension"),
    ).toBeInTheDocument();
  });
});
