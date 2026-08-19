/** @jsxRuntime automatic */
import type { RootlyCatalogEntity } from "@rootly/backstage-plugin-common";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { CatalogEntitiesTable } from "./CatalogEntitiesTable";

const mockGetCatalogs = jest.fn();
const mockGetCatalogEntities = jest.fn();
const mockGetCatalogEntityDetailsURL = jest.fn();
const mockUseRootlyClient = jest.fn();

jest.mock("../../api", () => ({
  useRootlyClient: (options: unknown) => mockUseRootlyClient(options),
}));
jest.mock("@material-ui/core", () => ({
  FormControl: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  InputLabel: ({ children }: { children: ReactNode }) => (
    <span>{children}</span>
  ),
  makeStyles: () => () => ({ empty: "empty", searchContainer: "search" }),
  MenuItem: ({ children, value }: { children: ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  Select: ({
    children,
    onChange,
    value,
  }: {
    children: ReactNode;
    onChange: (event: { target: { value: string } }) => void;
    value: string;
  }) => (
    <select
      aria-label="Catalog selector"
      onChange={(event) => onChange({ target: { value: event.target.value } })}
      value={value}
    >
      {children}
    </select>
  ),
  Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
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
jest.mock("@backstage/plugin-catalog-react", () => ({
  EntityRefLink: ({ entityRef }: { entityRef: { name: string } }) => (
    <div>Backstage entity {entityRef.name}</div>
  ),
}));
jest.mock("@backstage/plugin-search-react", () => ({
  SearchBarBase: ({
    onChange,
    placeholder,
    value,
  }: {
    onChange: (value: string) => void;
    placeholder: string;
    value: string;
  }) => (
    <input
      aria-label={placeholder}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
  ),
}));
jest.mock("@backstage/core-components", () => ({
  Table: ({
    columns,
    data,
    emptyContent,
    onPageChange,
    onRowsPerPageChange,
  }: {
    columns: Array<{
      field: string;
      render?: (row: RootlyCatalogEntity) => ReactNode;
    }>;
    data: RootlyCatalogEntity[];
    emptyContent: ReactNode;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (size: number) => void;
  }) => (
    <div>
      {data.length === 0 && emptyContent}
      {data.map((row) => (
        <div key={row.id}>
          {columns.map((column) => (
            <div key={column.field}>{column.render?.(row)}</div>
          ))}
        </div>
      ))}
      <button type="button" onClick={() => onPageChange(1)}>
        Next page
      </button>
      <button type="button" onClick={() => onRowsPerPageChange(25)}>
        Show 25
      </button>
    </div>
  ),
}));

const catalogs = [
  { id: "catalog-1", attributes: { name: "Primary", slug: "primary" } },
  { id: "catalog-2", attributes: { name: "Secondary", slug: "secondary" } },
];
const catalogEntity = {
  id: "entity-1",
  type: "catalog_entities",
  attributes: {
    backstage_id: "component:default/payments",
    created_at: "2026-01-01T00:00:00Z",
    description: "Payment service",
    name: "Payments",
    updated_at: "2026-01-02T00:00:00Z",
  },
} as unknown as RootlyCatalogEntity;

describe("CatalogEntitiesTable", () => {
  beforeEach(() => {
    mockGetCatalogs.mockReset().mockResolvedValue({ data: catalogs });
    mockGetCatalogEntities.mockReset().mockResolvedValue({
      data: [],
      meta: { total_count: 0 },
    });
    mockGetCatalogEntityDetailsURL
      .mockReset()
      .mockReturnValue("https://rootly.example/catalog/entities/entity-1");
    mockUseRootlyClient.mockReset().mockReturnValue({
      getCatalogs: mockGetCatalogs,
      getCatalogEntities: mockGetCatalogEntities,
      getCatalogEntityDetailsURL: mockGetCatalogEntityDetailsURL,
    });
  });

  it("loads the first catalog and its entities by default", async () => {
    render(
      <CatalogEntitiesTable
        organizationId="organization-id"
        params={{ filter: { kind: "Component" } }}
      />,
    );

    await waitFor(() => expect(mockGetCatalogEntities).toHaveBeenCalled());
    expect(mockUseRootlyClient).toHaveBeenCalledWith({
      organizationId: "organization-id",
    });
    expect(mockGetCatalogs).toHaveBeenCalledTimes(1);
    expect(mockGetCatalogEntities).toHaveBeenLastCalledWith("catalog-1", {
      filter: { kind: "Component", search: "" },
      page: { number: 1, size: 10 },
    });
  });

  it("renders Rootly and Backstage links with the active catalog slug", async () => {
    mockGetCatalogEntities.mockResolvedValue({
      data: [catalogEntity],
      meta: { total_count: 1 },
    });

    render(<CatalogEntitiesTable />);

    expect(await screen.findByText("Payments")).toHaveAttribute(
      "href",
      "https://rootly.example/catalog/entities/entity-1",
    );
    expect(mockGetCatalogEntityDetailsURL).toHaveBeenCalledWith(
      catalogEntity,
      "primary",
    );
    expect(screen.getByText("Backstage entity payments")).toBeInTheDocument();
  });

  it("switches catalogs and resets the page", async () => {
    render(<CatalogEntitiesTable />);
    await waitFor(() => expect(mockGetCatalogEntities).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    await waitFor(() =>
      expect(mockGetCatalogEntities).toHaveBeenLastCalledWith(
        "catalog-1",
        expect.objectContaining({ page: { number: 2, size: 10 } }),
      ),
    );

    fireEvent.change(screen.getByLabelText("Catalog selector"), {
      target: { value: "catalog-2" },
    });
    await waitFor(() =>
      expect(mockGetCatalogEntities).toHaveBeenLastCalledWith(
        "catalog-2",
        expect.objectContaining({ page: { number: 1, size: 10 } }),
      ),
    );
  });

  it("does not request entities when no catalogs exist", async () => {
    mockGetCatalogs.mockResolvedValue({ data: [] });

    render(<CatalogEntitiesTable />);

    expect(await screen.findByText("No catalog entities")).toBeInTheDocument();
    expect(mockGetCatalogEntities).not.toHaveBeenCalled();
  });

  it.each([
    ["catalog", mockGetCatalogs],
    ["entity", mockGetCatalogEntities],
  ])("renders %s API failures", async (_type, api) => {
    api.mockRejectedValue(new Error("Rootly unavailable"));

    render(<CatalogEntitiesTable />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Rootly unavailable",
    );
  });

  it("refetches for search and page-size changes", async () => {
    const user = userEvent.setup();
    render(<CatalogEntitiesTable />);
    await waitFor(() => expect(mockGetCatalogEntities).toHaveBeenCalled());

    await user.type(
      screen.getByLabelText("Search Catalog Entities"),
      "payments",
    );
    await waitFor(() =>
      expect(mockGetCatalogEntities).toHaveBeenLastCalledWith("catalog-1", {
        filter: { search: "payments" },
        page: { number: 1, size: 10 },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Show 25" }));
    await waitFor(() =>
      expect(mockGetCatalogEntities).toHaveBeenLastCalledWith("catalog-1", {
        filter: { search: "payments" },
        page: { number: 1, size: 25 },
      }),
    );
  });
});
