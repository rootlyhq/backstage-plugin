/** @jsxRuntime automatic */
import type { Entity } from "@backstage/catalog-model";
import {
  ROOTLY_ANNOTATION_CATALOG_ENTITY_ID,
  ROOTLY_ANNOTATION_ORG_ID,
} from "@rootly/backstage-plugin-common";
import { render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";

import { RootlyOverviewCatalogEntityCard } from "./RootlyOverviewCatalogEntityCard";
import { RootlyOverviewFunctionalityCard } from "./RootlyOverviewFunctionalityCard";
import { RootlyOverviewServiceCard } from "./RootlyOverviewServiceCard";
import { RootlyOverviewTeamCard } from "./RootlyOverviewTeamCard";

const mockUseEntity = jest.fn();
const mockUseRootlyClient = jest.fn();
const mockGetServices = jest.fn();
const mockGetFunctionalities = jest.fn();
const mockGetTeams = jest.fn();
const mockGetIncidents = jest.fn();
const mockGetServiceIncidentsChart = jest.fn();
const mockGetFunctionalityIncidentsChart = jest.fn();
const mockGetTeamIncidentsChart = jest.fn();
const mockGetCatalogEntity = jest.fn();
const mockGetCatalogEntityDetailsURL = jest.fn();

jest.mock("@backstage/plugin-catalog-react", () => ({
  useEntity: () => mockUseEntity(),
}));
jest.mock("../../api", () => ({
  useRootlyClient: (options: unknown) => mockUseRootlyClient(options),
}));
jest.mock("react-chartkick", () => ({
  LineChart: ({ data }: { data: unknown }) => (
    <div data-testid="incident-chart">{JSON.stringify(data)}</div>
  ),
}));
jest.mock("chartkick/chart.js", () => ({}));
jest.mock("../UI/ColoredChip", () => ({
  ColoredChip: ({ label }: { label?: string }) => <span>{label}</span>,
}));
jest.mock("../UI/StatusChip", () => ({
  StatusChip: ({ status }: { status: string }) => <span>{status}</span>,
}));
jest.mock("@backstage/core-components", () => ({
  HeaderIconLinkRow: ({
    links,
  }: {
    links: Array<{ href: string; label: string }>;
  }) => (
    <div>
      {links.map((link) => (
        <a href={link.href} key={link.label}>
          {link.label}
        </a>
      ))}
    </div>
  ),
  Progress: () => <div>Loading Rootly data</div>,
}));
jest.mock("@material-ui/core", () => ({
  Card: ({ children }: { children: ReactNode }) => (
    <section>{children}</section>
  ),
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardHeader: ({
    action,
    subheader,
    title,
  }: {
    action: ReactNode;
    subheader: ReactNode;
    title: ReactNode;
  }) => (
    <header>
      {title}
      {action}
      {subheader}
    </header>
  ),
  Divider: () => <hr />,
  IconButton: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick: () => void;
  }) => (
    <button type="button" aria-label="Refresh" onClick={onClick}>
      {children}
    </button>
  ),
  List: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ListItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ListItemSecondaryAction: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ListItemText: ({
    primary,
    secondary,
  }: {
    primary: ReactNode;
    secondary: ReactNode;
  }) => (
    <div>
      {primary}
      {secondary}
    </div>
  ),
  Typography: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
jest.mock("@material-ui/core/Link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
jest.mock("@material-ui/lab", () => ({
  Alert: ({ children }: { children: ReactNode }) => (
    <div role="alert">{children}</div>
  ),
}));
jest.mock("@material-ui/icons/FilterList", () => () => <span />);
jest.mock("@material-ui/icons/Cached", () => () => <span />);
jest.mock("@material-ui/icons/Whatshot", () => () => <span />);

const entity = (annotations: Record<string, string> = {}): Entity => ({
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    annotations: {
      [ROOTLY_ANNOTATION_ORG_ID]: "organization-id",
      ...annotations,
    },
    name: "payments",
    namespace: "default",
  },
});

const client = {
  getCatalogEntity: mockGetCatalogEntity,
  getCatalogEntityDetailsURL: mockGetCatalogEntityDetailsURL,
  getCreateIncidentURL: () => "https://rootly.example/incidents/new",
  getFunctionalities: mockGetFunctionalities,
  getFunctionalityIncidentsChart: mockGetFunctionalityIncidentsChart,
  getIncidents: mockGetIncidents,
  getListIncidents: () => "https://rootly.example/incidents",
  getListIncidentsForFunctionalityURL: () =>
    "https://rootly.example/incidents/functionality",
  getListIncidentsForServiceURL: () =>
    "https://rootly.example/incidents/service",
  getListIncidentsForTeamURL: () => "https://rootly.example/incidents/team",
  getServiceIncidentsChart: mockGetServiceIncidentsChart,
  getServices: mockGetServices,
  getTeamIncidentsChart: mockGetTeamIncidentsChart,
  getTeams: mockGetTeams,
};

const cases: Array<{
  chart: jest.Mock;
  component: ComponentType;
  filter: string;
  primary: jest.Mock;
  type: "service" | "functionality" | "team";
}> = [
  {
    chart: mockGetServiceIncidentsChart,
    component: RootlyOverviewServiceCard,
    filter: "services",
    primary: mockGetServices,
    type: "service",
  },
  {
    chart: mockGetFunctionalityIncidentsChart,
    component: RootlyOverviewFunctionalityCard,
    filter: "functionalities",
    primary: mockGetFunctionalities,
    type: "functionality",
  },
  {
    chart: mockGetTeamIncidentsChart,
    component: RootlyOverviewTeamCard,
    filter: "teams",
    primary: mockGetTeams,
    type: "team",
  },
];

describe.each(cases)("Rootly $type overview card", (testCase) => {
  const CardComponent = testCase.component;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntity.mockReturnValue({ entity: entity() });
    mockUseRootlyClient.mockReturnValue(client);
    mockGetIncidents.mockResolvedValue({ data: [] });
    mockGetServiceIncidentsChart.mockResolvedValue({ data: [["day", 1]] });
    mockGetFunctionalityIncidentsChart.mockResolvedValue({
      data: [["day", 1]],
    });
    mockGetTeamIncidentsChart.mockResolvedValue({ data: [["day", 1]] });
    testCase.primary.mockResolvedValue({
      data: [
        {
          id: `${testCase.type}-id`,
          attributes: { name: "Payments", slug: "payments" },
        },
      ],
    });
  });

  it("loads the annotated organization, resource, incidents, and chart", async () => {
    render(<CardComponent />);

    expect(await screen.findByText("No ongoing incidents")).toBeInTheDocument();
    expect(mockUseRootlyClient).toHaveBeenCalledWith({
      organizationId: "organization-id",
    });
    expect(testCase.primary).toHaveBeenCalledWith({
      filter: { backstage_id: "component:default/payments" },
    });
    expect(mockGetIncidents).toHaveBeenCalledWith({
      filter: {
        [testCase.filter]: "payments",
        status: "started,mitigated",
      },
    });
    expect(testCase.chart).toHaveBeenCalledWith(
      expect.objectContaining({ id: `${testCase.type}-id` }),
      { period: "day" },
    );
    expect(screen.getByTestId("incident-chart")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create Incident" }),
    ).toHaveAttribute("href", "https://rootly.example/incidents/new");
  });

  it("renders resource lookup failures", async () => {
    testCase.primary.mockRejectedValue(new Error("Rootly unavailable"));

    render(<CardComponent />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Rootly unavailable",
    );
  });
});

describe("Rootly catalog-entity overview card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRootlyClient.mockReturnValue(client);
    mockGetCatalogEntityDetailsURL.mockReturnValue(
      "https://rootly.example/catalog/entity",
    );
  });

  it("renders catalog details, properties, and the Rootly link", async () => {
    mockUseEntity.mockReturnValue({
      entity: entity({
        [ROOTLY_ANNOTATION_CATALOG_ENTITY_ID]: "catalog-entity-id",
      }),
    });
    const catalogEntity = {
      id: "catalog-entity-id",
      attributes: {
        description: "Payment service",
        name: "Payments Catalog Entry",
        properties: [{ catalog_property_id: "tier", value: "critical" }],
      },
    };
    mockGetCatalogEntity.mockResolvedValue({
      data: catalogEntity,
      included: [{ type: "catalogs", attributes: { slug: "service-catalog" } }],
    });

    render(<RootlyOverviewCatalogEntityCard />);

    expect(
      await screen.findByText("Payments Catalog Entry"),
    ).toBeInTheDocument();
    expect(screen.getByText("Payment service")).toBeInTheDocument();
    expect(screen.getByText(/critical/)).toBeInTheDocument();
    expect(mockGetCatalogEntity).toHaveBeenCalledWith("catalog-entity-id", {
      include: "catalog",
    });
    expect(mockGetCatalogEntityDetailsURL).toHaveBeenCalledWith(
      catalogEntity,
      "service-catalog",
    );
    expect(
      screen.getByRole("link", { name: "View in Rootly" }),
    ).toHaveAttribute("href", "https://rootly.example/catalog/entity");
  });

  it("renders missing and failed catalog entities", async () => {
    mockUseEntity.mockReturnValue({ entity: entity() });
    const { unmount } = render(<RootlyOverviewCatalogEntityCard />);
    expect(
      await screen.findByText("Catalog entity not found in Rootly"),
    ).toBeInTheDocument();
    expect(mockGetCatalogEntity).not.toHaveBeenCalled();
    unmount();

    mockUseEntity.mockReturnValue({
      entity: entity({
        [ROOTLY_ANNOTATION_CATALOG_ENTITY_ID]: "catalog-entity-id",
      }),
    });
    mockGetCatalogEntity.mockRejectedValue(new Error("Rootly unavailable"));
    render(<RootlyOverviewCatalogEntityCard />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Rootly unavailable",
    );
  });
});
