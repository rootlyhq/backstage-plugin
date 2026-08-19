/** @jsxRuntime automatic */
import {
  ROOTLY_ANNOTATION_ORG_ID,
  type RootlyEntity,
} from "@rootly/backstage-plugin-common";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import { RootlySystemIncidentsPageLayout } from "./RootlySystemIncidentsPageLayout";

const mockUseRootlyClient = jest.fn();

jest.mock("../../api", () => ({
  useRootlyClient: (options: unknown) => mockUseRootlyClient(options),
}));
jest.mock("@backstage/core-components", () => ({
  Content: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ContentHeader: ({ title }: { title: string }) => <h2>{title}</h2>,
  Page: ({ children }: { children: ReactNode }) => <main>{children}</main>,
  Progress: () => <div>Loading system incidents</div>,
}));
jest.mock("@material-ui/core", () => ({
  Grid: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
jest.mock("@material-ui/lab", () => ({
  Alert: ({ children }: { children: ReactNode }) => (
    <div role="alert">{children}</div>
  ),
}));
jest.mock("../IncidentsTable", () => ({
  IncidentsTable: ({
    organizationId,
    params,
  }: {
    organizationId: string;
    params: {
      filter: {
        functionalities: string;
        groups: string;
        services: string;
        status?: string;
      };
    };
  }) => (
    <div
      data-testid={`incidents-${organizationId}-${
        params.filter.status ? "ongoing" : "past"
      }`}
    >
      {JSON.stringify(params.filter)}
    </div>
  ),
}));

const entity = (
  name: string,
  organizationId: string,
  rootlyKind: "Service" | "Functionality" | "Team",
): RootlyEntity =>
  ({
    apiVersion: "backstage.io/v1alpha1",
    kind: "Component",
    metadata: {
      annotations: { [ROOTLY_ANNOTATION_ORG_ID]: organizationId },
      name,
    },
    rootlyKind,
  }) as unknown as RootlyEntity;

const resource = (slug: string) => ({ attributes: { slug } });

const client = () => ({
  getFunctionalities: jest.fn().mockResolvedValue({ data: [] }),
  getServices: jest.fn().mockResolvedValue({ data: [] }),
  getTeams: jest.fn().mockResolvedValue({ data: [] }),
});

describe("RootlySystemIncidentsPageLayout", () => {
  beforeEach(() => {
    mockUseRootlyClient.mockReset();
  });

  it("aggregates resources per organization into ongoing and past incident filters", async () => {
    const organizationA = client();
    organizationA.getServices.mockResolvedValue({
      data: [resource("service-a")],
    });
    organizationA.getFunctionalities.mockResolvedValue({
      data: [resource("functionality-a")],
    });
    organizationA.getTeams.mockResolvedValue({ data: [resource("team-a")] });
    const organizationB = client();
    organizationB.getServices.mockResolvedValue({
      data: [resource("service-b")],
    });

    mockUseRootlyClient.mockImplementation(
      ({ organizationId }: { organizationId: string }) =>
        organizationId === "organization-a" ? organizationA : organizationB,
    );

    render(
      <RootlySystemIncidentsPageLayout
        entities={[
          entity("service-a", "organization-a", "Service"),
          entity("functionality-a", "organization-a", "Functionality"),
          entity("team-a", "organization-a", "Team"),
          entity("service-b", "organization-b", "Service"),
        ]}
      />,
    );

    expect(
      JSON.parse(
        (await screen.findByTestId("incidents-organization-a-ongoing"))
          .textContent ?? "{}",
      ),
    ).toEqual({
      functionalities: "functionality-a",
      groups: "team-a",
      services: "service-a",
      status: "started,mitigated",
    });
    expect(
      JSON.parse(
        screen.getByTestId("incidents-organization-a-past").textContent ?? "{}",
      ),
    ).toEqual({
      functionalities: "functionality-a",
      groups: "team-a",
      services: "service-a",
    });
    expect(
      screen.getByTestId("incidents-organization-b-ongoing"),
    ).toHaveTextContent('"services":"service-b"');

    expect(organizationA.getServices).toHaveBeenCalledWith({
      filter: { backstage_id: "component:default/service-a" },
    });
    expect(organizationA.getFunctionalities).toHaveBeenCalledWith({
      filter: { backstage_id: "component:default/functionality-a" },
    });
    expect(organizationA.getTeams).toHaveBeenCalledWith({
      filter: { backstage_id: "component:default/team-a" },
    });
  });

  it("keeps rendering successful resource types when one request fails", async () => {
    const organization = client();
    organization.getServices.mockRejectedValue(
      new Error("services unavailable"),
    );
    organization.getTeams.mockResolvedValue({ data: [resource("team-a")] });
    mockUseRootlyClient.mockReturnValue(organization);

    render(
      <RootlySystemIncidentsPageLayout
        entities={[
          entity("service-a", "organization-a", "Service"),
          entity("team-a", "organization-a", "Team"),
        ]}
      />,
    );

    expect(
      JSON.parse(
        (await screen.findByTestId("incidents-organization-a-ongoing"))
          .textContent ?? "{}",
      ),
    ).toEqual({
      functionalities: "",
      groups: "team-a",
      services: "",
      status: "started,mitigated",
    });
  });

  it("does not request or render organizations when the System has no Rootly children", async () => {
    render(<RootlySystemIncidentsPageLayout entities={[]} />);

    await waitFor(() =>
      expect(
        screen.queryByText("Loading system incidents"),
      ).not.toBeInTheDocument(),
    );
    expect(mockUseRootlyClient).not.toHaveBeenCalled();
    expect(screen.queryByTestId(/incidents-/)).not.toBeInTheDocument();
  });
});
