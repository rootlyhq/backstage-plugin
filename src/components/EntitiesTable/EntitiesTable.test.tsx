/** @jsxRuntime automatic */
import type { Entity } from "@backstage/catalog-model";
import {
  ROOTLY_ANNOTATION_CATALOG_ENTITY_ID,
  ROOTLY_ANNOTATION_ORG_ID,
} from "@rootly/backstage-plugin-common";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import { EntitiesTable } from "./EntitiesTable";

const mockGetEntities = jest.fn();
const mockGetServices = jest.fn();
const mockGetFunctionalities = jest.fn();
const mockGetTeams = jest.fn();
const mockGetCatalogEntity = jest.fn();
const mockUseRootlyClient = jest.fn();

jest.mock("@backstage/core-plugin-api", () => ({
  useApi: () => ({ getEntities: mockGetEntities }),
}));
jest.mock("@backstage/plugin-catalog-react", () => ({
  catalogApiRef: {},
  EntityRefLink: ({ entityRef }: { entityRef: Entity }) => (
    <div>Backstage entity {entityRef.metadata.name}</div>
  ),
}));
jest.mock("../../api", () => ({
  useRootlyClient: (options: unknown) => mockUseRootlyClient(options),
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
jest.mock("@backstage/core-components", () => ({
  Progress: () => <div>Loading link</div>,
  Table: ({
    columns,
    data,
  }: {
    columns: Array<{
      field: string;
      render?: (row: Entity) => ReactNode;
    }>;
    data: Entity[];
  }) => (
    <div>
      {data.map((row) => (
        <div key={row.metadata.name}>
          {columns.map((column, index) => (
            <div key={`${column.field}-${index}`}>{column.render?.(row)}</div>
          ))}
        </div>
      ))}
    </div>
  ),
}));

const entity = (annotations: Record<string, string> = {}): Entity => ({
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    annotations,
    name: "payments",
    namespace: "default",
  },
});

const resource = (name: string) => ({
  id: `${name.toLowerCase()}-id`,
  attributes: { name },
});

describe("EntitiesTable", () => {
  beforeEach(() => {
    mockGetEntities.mockReset().mockResolvedValue({ items: [] });
    mockGetServices.mockReset().mockResolvedValue({ data: [] });
    mockGetFunctionalities.mockReset().mockResolvedValue({ data: [] });
    mockGetTeams.mockReset().mockResolvedValue({ data: [] });
    mockGetCatalogEntity.mockReset().mockResolvedValue(undefined);
    mockUseRootlyClient.mockReset().mockReturnValue({
      getCatalogEntity: mockGetCatalogEntity,
      getCatalogEntityDetailsURL: () => "https://rootly/catalog-entity",
      getFunctionalities: mockGetFunctionalities,
      getFunctionalityDetailsURL: () => "https://rootly/functionality",
      getServices: mockGetServices,
      getServiceDetailsURL: () => "https://rootly/service",
      getTeams: mockGetTeams,
      getTeamDetailsURL: () => "https://rootly/team",
    });
  });

  it("looks up all Rootly resource types using the Backstage entity ref", async () => {
    mockGetEntities.mockResolvedValue({
      items: [
        entity({
          [ROOTLY_ANNOTATION_ORG_ID]: "organization-id",
          [ROOTLY_ANNOTATION_CATALOG_ENTITY_ID]: "catalog-entity-id",
        }),
      ],
    });
    mockGetServices.mockResolvedValue({ data: [resource("Service")] });
    mockGetFunctionalities.mockResolvedValue({
      data: [resource("Functionality")],
    });
    mockGetTeams.mockResolvedValue({ data: [resource("Team")] });
    mockGetCatalogEntity.mockResolvedValue({
      data: resource("Catalog Entity"),
      included: [{ type: "catalogs", attributes: { slug: "main-catalog" } }],
    });

    render(<EntitiesTable />);

    expect(await screen.findByText("Service")).toHaveAttribute(
      "href",
      "https://rootly/service",
    );
    expect(screen.getByText("Functionality")).toHaveAttribute(
      "href",
      "https://rootly/functionality",
    );
    expect(screen.getByText("Team")).toHaveAttribute(
      "href",
      "https://rootly/team",
    );
    expect(screen.getByText("Catalog Entity")).toHaveAttribute(
      "href",
      "https://rootly/catalog-entity",
    );
    expect(mockUseRootlyClient).toHaveBeenCalledWith({
      organizationId: "organization-id",
    });
    const expectedFilter = {
      filter: { backstage_id: "component:default/payments" },
    };
    expect(mockGetServices).toHaveBeenCalledWith(expectedFilter);
    expect(mockGetFunctionalities).toHaveBeenCalledWith(expectedFilter);
    expect(mockGetTeams).toHaveBeenCalledWith(expectedFilter);
    expect(mockGetCatalogEntity).toHaveBeenCalledWith("catalog-entity-id", {
      include: "catalog",
    });
  });

  it("renders unlinked states and skips catalog lookup without an annotation", async () => {
    mockGetEntities.mockResolvedValue({ items: [entity()] });

    render(<EntitiesTable />);

    await waitFor(() =>
      expect(screen.getAllByText("Not Linked")).toHaveLength(3),
    );
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(mockGetCatalogEntity).not.toHaveBeenCalled();
  });

  it("renders individual Rootly lookup failures without failing the table", async () => {
    mockGetEntities.mockResolvedValue({ items: [entity()] });
    mockGetServices.mockRejectedValue(new Error("service unavailable"));
    mockGetFunctionalities.mockRejectedValue(
      new Error("functionality unavailable"),
    );
    mockGetTeams.mockRejectedValue(new Error("team unavailable"));

    render(<EntitiesTable />);

    await waitFor(() => expect(screen.getAllByText("Error")).toHaveLength(3));
  });

  it("renders Backstage catalog API failures", async () => {
    mockGetEntities.mockRejectedValue(new Error("Catalog unavailable"));

    render(<EntitiesTable />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Catalog unavailable",
    );
  });
});
