/** @jsxRuntime automatic */
import type { Entity } from "@backstage/catalog-model";
import {
  ROOTLY_ANNOTATION_CATALOG_ENTITY_ID,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG,
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
} from "@rootly/backstage-plugin-common";
import { render, screen } from "@testing-library/react";

import { RootlyOverviewCard } from "./RootlyOverviewCard";

const mockUseEntity = jest.fn();

jest.mock("@backstage/plugin-catalog-react", () => ({
  ...jest.requireActual("@backstage/plugin-catalog-react"),
  useEntity: () => mockUseEntity(),
}));

jest.mock("./RootlyOverviewServiceCard", () => ({
  RootlyOverviewServiceCard: () => <div>service overview</div>,
}));
jest.mock("./RootlyOverviewFunctionalityCard", () => ({
  RootlyOverviewFunctionalityCard: () => <div>functionality overview</div>,
}));
jest.mock("./RootlyOverviewTeamCard", () => ({
  RootlyOverviewTeamCard: () => <div>team overview</div>,
}));
jest.mock("./RootlyOverviewCatalogEntityCard", () => ({
  RootlyOverviewCatalogEntityCard: () => <div>catalog entity overview</div>,
}));

const entityWithAnnotations = (
  annotations?: Record<string, string>,
): Entity => ({
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: { annotations, name: "example" },
});

const cases = [
  [ROOTLY_ANNOTATION_SERVICE_ID, "service overview"],
  [ROOTLY_ANNOTATION_SERVICE_SLUG, "service overview"],
  [ROOTLY_ANNOTATION_FUNCTIONALITY_ID, "functionality overview"],
  [ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, "functionality overview"],
  [ROOTLY_ANNOTATION_TEAM_ID, "team overview"],
  [ROOTLY_ANNOTATION_TEAM_SLUG, "team overview"],
  [ROOTLY_ANNOTATION_CATALOG_ENTITY_ID, "catalog entity overview"],
  [ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG, "catalog entity overview"],
] as const;

describe("RootlyOverviewCard", () => {
  it.each(cases)("renders the matching card for %s", (annotation, expected) => {
    mockUseEntity.mockReturnValue({
      entity: entityWithAnnotations({ [annotation]: "rootly-id" }),
    });

    render(<RootlyOverviewCard />);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("uses service, functionality, team, then catalog precedence", () => {
    mockUseEntity.mockReturnValue({
      entity: entityWithAnnotations({
        [ROOTLY_ANNOTATION_CATALOG_ENTITY_ID]: "catalog",
        [ROOTLY_ANNOTATION_FUNCTIONALITY_ID]: "functionality",
        [ROOTLY_ANNOTATION_SERVICE_ID]: "service",
        [ROOTLY_ANNOTATION_TEAM_ID]: "team",
      }),
    });

    render(<RootlyOverviewCard />);

    expect(screen.getByText("service overview")).toBeInTheDocument();
    expect(
      screen.queryByText("functionality overview"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("team overview")).not.toBeInTheDocument();
    expect(
      screen.queryByText("catalog entity overview"),
    ).not.toBeInTheDocument();
  });

  it("shows a useful fallback without Rootly annotations", () => {
    mockUseEntity.mockReturnValue({ entity: entityWithAnnotations() });

    render(<RootlyOverviewCard />);

    expect(screen.getByText("No Rootly annotations found")).toBeInTheDocument();
  });
});
