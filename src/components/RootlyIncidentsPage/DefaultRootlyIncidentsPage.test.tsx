/** @jsxRuntime automatic */
import type { Entity } from "@backstage/catalog-model";
import {
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_ORG_ID,
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
} from "@rootly/backstage-plugin-common";
import { render, screen, waitFor } from "@testing-library/react";

import { DefaultRootlyIncidentsPage } from "./DefaultRootlyIncidentsPage";

const mockUseApi = jest.fn();
const mockUseEntity = jest.fn();

jest.mock("@backstage/core-plugin-api", () => ({
  ...jest.requireActual("@backstage/core-plugin-api"),
  useApi: () => mockUseApi(),
}));
jest.mock("@backstage/plugin-catalog-react", () => ({
  ...jest.requireActual("@backstage/plugin-catalog-react"),
  useEntity: () => mockUseEntity(),
}));
jest.mock("./RootlyServiceIncidentsPageLayout", () => ({
  RootlyServiceIncidentsPageLayout: ({
    organizationId,
  }: {
    organizationId?: string;
  }) => <div>service incidents for {organizationId}</div>,
}));
jest.mock("./RootlyFunctionalityIncidentsPageLayout", () => ({
  RootlyFunctionalityIncidentsPageLayout: ({
    organizationId,
  }: {
    organizationId?: string;
  }) => <div>functionality incidents for {organizationId}</div>,
}));
jest.mock("./RootlyTeamIncidentsPageLayout", () => ({
  RootlyTeamIncidentsPageLayout: ({
    organizationId,
  }: {
    organizationId?: string;
  }) => <div>team incidents for {organizationId}</div>,
}));
jest.mock("./RootlySystemIncidentsPageLayout", () => ({
  RootlySystemIncidentsPageLayout: ({ entities }: { entities: Entity[] }) => (
    <div>
      system incidents for{" "}
      {entities.map((entity) => entity.metadata.name).join(",")}
    </div>
  ),
}));

const entityWithAnnotations = (
  annotations?: Record<string, string>,
  overrides: Partial<Entity> = {},
): Entity => ({
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  ...overrides,
  metadata: { annotations, name: "example", ...overrides.metadata },
});

const dispatchCases = [
  [ROOTLY_ANNOTATION_SERVICE_ID, "service incidents"],
  [ROOTLY_ANNOTATION_SERVICE_SLUG, "service incidents"],
  [ROOTLY_ANNOTATION_FUNCTIONALITY_ID, "functionality incidents"],
  [ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, "functionality incidents"],
  [ROOTLY_ANNOTATION_TEAM_ID, "team incidents"],
  [ROOTLY_ANNOTATION_TEAM_SLUG, "team incidents"],
] as const;

describe("DefaultRootlyIncidentsPage", () => {
  const catalogApi = { getEntityByRef: jest.fn() };

  beforeEach(() => {
    catalogApi.getEntityByRef.mockReset();
    mockUseApi.mockReturnValue(catalogApi);
  });

  it.each(dispatchCases)(
    "dispatches %s entities to the expected incidents layout",
    async (annotation, expected) => {
      mockUseEntity.mockReturnValue({
        entity: entityWithAnnotations({
          [annotation]: "rootly-id",
          [ROOTLY_ANNOTATION_ORG_ID]: "organization-from-entity",
        }),
      });

      render(<DefaultRootlyIncidentsPage />);

      expect(
        await screen.findByText(`${expected} for organization-from-entity`),
      ).toBeInTheDocument();
    },
  );

  it("prefers an explicitly supplied organization", async () => {
    mockUseEntity.mockReturnValue({
      entity: entityWithAnnotations({
        [ROOTLY_ANNOTATION_ORG_ID]: "organization-from-entity",
        [ROOTLY_ANNOTATION_SERVICE_ID]: "service",
      }),
    });

    render(
      <DefaultRootlyIncidentsPage organizationId="organization-from-props" />,
    );

    expect(
      await screen.findByText("service incidents for organization-from-props"),
    ).toBeInTheDocument();
  });

  it("shows a fallback for an entity without supported annotations", async () => {
    mockUseEntity.mockReturnValue({ entity: entityWithAnnotations() });

    render(<DefaultRootlyIncidentsPage />);

    expect(
      await screen.findByText("No Rootly annotations found"),
    ).toBeInTheDocument();
  });

  it("shows a fallback for a System without hasPart relations", async () => {
    mockUseEntity.mockReturnValue({
      entity: entityWithAnnotations(undefined, { kind: "System" }),
    });

    render(<DefaultRootlyIncidentsPage />);

    expect(
      await screen.findByText("No Rootly annotations found"),
    ).toBeInTheDocument();
    expect(catalogApi.getEntityByRef).not.toHaveBeenCalled();
  });

  it("resolves a single annotated System child", async () => {
    const system = entityWithAnnotations(undefined, {
      kind: "System",
      relations: [{ targetRef: "component:default/child", type: "hasPart" }],
    });
    catalogApi.getEntityByRef.mockResolvedValue(
      entityWithAnnotations({
        [ROOTLY_ANNOTATION_ORG_ID]: "child-organization",
        [ROOTLY_ANNOTATION_SERVICE_ID]: "service",
      }),
    );
    mockUseEntity.mockReturnValue({ entity: system });

    render(<DefaultRootlyIncidentsPage />);

    expect(
      await screen.findByText("service incidents for child-organization"),
    ).toBeInTheDocument();
    expect(catalogApi.getEntityByRef).toHaveBeenCalledWith(
      "component:default/child",
    );
  });

  it("aggregates multiple annotated System children and ignores unconfigured children", async () => {
    const system = entityWithAnnotations(undefined, {
      kind: "System",
      relations: [
        { targetRef: "component:default/service", type: "hasPart" },
        { targetRef: "component:default/team", type: "hasPart" },
        { targetRef: "component:default/unconfigured", type: "hasPart" },
        { targetRef: "component:default/ignored", type: "ownedBy" },
      ],
    });
    catalogApi.getEntityByRef
      .mockResolvedValueOnce(
        entityWithAnnotations(
          {
            [ROOTLY_ANNOTATION_ORG_ID]: "first-organization",
            [ROOTLY_ANNOTATION_SERVICE_ID]: "service",
          },
          { metadata: { name: "service-child" } },
        ),
      )
      .mockResolvedValueOnce(
        entityWithAnnotations(
          {
            [ROOTLY_ANNOTATION_ORG_ID]: "second-organization",
            [ROOTLY_ANNOTATION_TEAM_ID]: "team",
          },
          { metadata: { name: "team-child" } },
        ),
      )
      .mockResolvedValueOnce(entityWithAnnotations());
    mockUseEntity.mockReturnValue({ entity: system });

    render(<DefaultRootlyIncidentsPage />);

    expect(
      await screen.findByText("system incidents for service-child,team-child"),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(catalogApi.getEntityByRef).toHaveBeenCalledTimes(3),
    );
  });
});
