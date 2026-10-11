/** @jsxRuntime automatic */
import type { RootlyIncident } from "@rootly/backstage-plugin-common";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { IncidentsTable } from "./IncidentsTable";

const mockGetIncidents = jest.fn();
const mockUseRootlyClient = jest.fn();

const mockSettings = jest.fn();

jest.mock("../../api", () => ({
  useRootlyClient: (options: unknown) => mockUseRootlyClient(options),
  useRootlyInstanceSettings: (options: unknown) => mockSettings(options),
}));
jest.mock("../UI/ColoredChip", () => ({
  ColoredChip: ({ label }: { label?: string }) => <div>{label}</div>,
}));
jest.mock("../UI/ColoredChips", () => ({
  ColoredChips: ({
    objects,
  }: {
    objects: Array<{ attributes: { name: string } }>;
  }) => <div>{objects.map((object) => object.attributes.name).join(", ")}</div>,
}));
jest.mock("../UI/StatusChip", () => ({
  StatusChip: ({ status }: { status: string }) => <div>{status}</div>,
}));
jest.mock("@material-ui/core", () => ({
  Chip: ({ label }: { label?: string }) => <div>{label}</div>,
  makeStyles: () => () => ({ searchContainer: "search" }),
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
jest.mock("./IncidentsFilters", () => ({
  IncidentsFilters: ({
    available,
    onFiltersChange,
    showTestIncidents,
    onShowTestIncidentsChange,
  }: {
    available: string[];
    onFiltersChange: (filters: unknown) => void;
    showTestIncidents: boolean;
    onShowTestIncidentsChange: (show: boolean) => void;
  }) => (
    <div>
      <span>filters: {available.join(",")}</span>
      <button
        type="button"
        onClick={() =>
          onFiltersChange({
            status: [{ id: "resolved", label: "Resolved" }],
            severity: [{ id: "sev-1", label: "SEV1" }],
            teams: [{ id: "team-1", label: "Payments" }],
            services: [],
            environments: [],
          })
        }
      >
        Apply filters
      </button>
      <button
        type="button"
        onClick={() => onShowTestIncidentsChange(!showTestIncidents)}
      >
        Toggle test incidents ({String(showTestIncidents)})
      </button>
    </div>
  ),
}));

type MockColumn = {
  title: string;
  field: string;
  defaultSort?: "asc" | "desc";
  sorting?: boolean;
  render?: (row: unknown) => ReactNode;
};
type MockQuery = {
  page: number;
  pageSize: number;
  orderBy?: MockColumn;
  orderDirection: "asc" | "desc";
};

// Minimal stand-in for Material Table remote data: calls `data(query)` and
// exposes `onQueryChange` through `tableRef` like the real component does.
jest.mock("@backstage/core-components", () => {
  const { useEffect, useRef, useState } =
    jest.requireActual<typeof import("react")>("react");
  return {
    Table: ({
      columns,
      data,
      tableRef,
      localization,
    }: {
      columns: MockColumn[];
      data: (query: MockQuery) => Promise<{ data: unknown[] }>;
      tableRef: { current: unknown };
      localization: { body: { emptyDataSourceMessage: string } };
    }) => {
      const [rows, setRows] = useState<unknown[]>([]);
      const query = useRef<MockQuery>({
        page: 0,
        pageSize: 10,
        orderBy: columns.find((column) => column.defaultSort),
        orderDirection: "desc",
      });
      const run = (change: Partial<MockQuery>) => {
        query.current = { ...query.current, ...change };
        data(query.current).then((result) => setRows(result.data));
      };
      tableRef.current = { onQueryChange: run };
      useEffect(() => run({}), []); // eslint-disable-line react-hooks/exhaustive-deps

      return (
        <div>
          {columns.map((column) => (
            <span key={column.title} data-sortable={String(column.sorting)}>
              {column.title}
            </span>
          ))}
          {rows.length === 0 && localization.body.emptyDataSourceMessage}
          {rows.map((row, rowIndex) => (
            <div key={rowIndex}>
              {columns.map((column) => (
                <div key={column.title}>{column.render?.(row)}</div>
              ))}
            </div>
          ))}
          <button type="button" onClick={() => run({ page: 1 })}>
            Next page
          </button>
          <button type="button" onClick={() => run({ pageSize: 25 })}>
            Show 25
          </button>
          <button
            type="button"
            onClick={() =>
              run({
                orderBy: columns.find((column) => column.title === "Resolved At"),
                orderDirection: "asc",
              })
            }
          >
            Sort by resolved
          </button>
        </div>
      );
    },
  };
});

const incident = {
  id: "incident-1",
  type: "incidents",
  attributes: {
    created_at: "2026-01-01T00:00:00Z",
    started_at: "2026-01-01T00:00:00Z",
    status: "started",
    summary: "Payment processing is degraded",
    title: "Payments degraded",
    url: "https://rootly.example/incidents/incident-1",
    user: { data: { attributes: { full_name: "Ada Lovelace" } } },
    severity: {
      data: {
        attributes: {
          color: "#ff0000",
          description: "Major incident",
          name: "SEV-1",
        },
      },
    },
  },
  relationships: {
    environments: { data: [{ id: "environment-1" }] },
    services: { data: [{ id: "service-1" }] },
    functionalities: { data: [{ id: "functionality-1" }] },
    groups: { data: [{ id: "group-1" }] },
  },
} as unknown as RootlyIncident;

const included = [
  {
    id: "environment-1",
    type: "environments",
    attributes: { name: "Production" },
  },
  { id: "service-1", type: "services", attributes: { name: "Payments" } },
  {
    id: "functionality-1",
    type: "functionalities",
    attributes: { name: "Checkout" },
  },
  { id: "group-1", type: "groups", attributes: { name: "Reliability" } },
];

const response = (data: RootlyIncident[]) => ({
  data,
  included,
  meta: { total_count: data.length },
});

const hideTestIncidents = { kind: { not_in: "test,test_sub" } };

describe("IncidentsTable", () => {
  beforeEach(() => {
    mockGetIncidents.mockReset().mockResolvedValue(response([]));
    mockUseRootlyClient.mockReset().mockReturnValue({
      getIncidents: mockGetIncidents,
    });
    mockSettings.mockReset().mockReturnValue({ showTestIncidents: false });
  });

  it("passes organization, scope, sort, and pagination to Rootly and hides test incidents", async () => {
    render(
      <IncidentsTable
        organizationId="organization-id"
        params={{ filter: { status: "started" } }}
      />,
    );

    await waitFor(() => expect(mockGetIncidents).toHaveBeenCalled());
    expect(mockUseRootlyClient).toHaveBeenCalledWith({
      organizationId: "organization-id",
    });
    expect(mockSettings).toHaveBeenCalledWith({
      organizationId: "organization-id",
    });
    expect(mockGetIncidents).toHaveBeenLastCalledWith({
      filter: { search: "", status: "started", ...hideTestIncidents },
      page: { number: 1, size: 10 },
      sort: "-started_at",
    });
    expect(
      screen.getByText("filters: severity,teams,services,environments"),
    ).toBeInTheDocument();
  });

  it("includes test incidents when the instance enables them", async () => {
    mockSettings.mockReturnValue({ showTestIncidents: true });
    render(<IncidentsTable />);

    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith({
        filter: { search: "" },
        page: { number: 1, size: 10 },
        sort: "-started_at",
      }),
    );
  });

  it("refetches from the first page when filters or the test toggle change", async () => {
    render(<IncidentsTable />);
    await waitFor(() => expect(mockGetIncidents).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: { number: 2, size: 10 } }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith({
        filter: {
          search: "",
          status: "resolved",
          severity_id: "sev-1",
          team_ids: "team-1",
          ...hideTestIncidents,
        },
        page: { number: 1, size: 10 },
        sort: "-started_at",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Toggle test incidents (false)" }),
    );
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filter: {
            search: "",
            status: "resolved",
            severity_id: "sev-1",
            team_ids: "team-1",
          },
        }),
      ),
    );
  });

  it("sorts server-side and only on columns the API can sort", async () => {
    render(<IncidentsTable />);
    await waitFor(() => expect(mockGetIncidents).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Started At")).toHaveAttribute(
      "data-sortable",
      "true",
    );
    expect(screen.getByText("Resolved At")).toHaveAttribute(
      "data-sortable",
      "true",
    );
    expect(screen.getByText("Title")).toHaveAttribute("data-sortable", "false");
    expect(screen.getByText("Severity")).toHaveAttribute(
      "data-sortable",
      "false",
    );

    fireEvent.click(screen.getByRole("button", { name: "Sort by resolved" }));
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith(
        expect.objectContaining({ sort: "resolved_at" }),
      ),
    );
  });

  it("hides the filter bar when disabled", async () => {
    render(<IncidentsTable showFilters={false} />);
    await waitFor(() => expect(mockGetIncidents).toHaveBeenCalled());
    expect(screen.queryByText(/^filters:/)).not.toBeInTheDocument();
  });

  it("renders incident details and included relationships", async () => {
    mockGetIncidents.mockResolvedValue(response([incident]));

    render(<IncidentsTable />);

    expect(await screen.findByText("Payments degraded")).toHaveAttribute(
      "href",
      "https://rootly.example/incidents/incident-1",
    );
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("started")).toBeInTheDocument();
    expect(screen.getByText("SEV-1")).toBeInTheDocument();
    expect(screen.getByText("Production")).toBeInTheDocument();
    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("Reliability")).toBeInTheDocument();
  });

  it("renders empty and error states", async () => {
    const { unmount } = render(<IncidentsTable />);
    expect(await screen.findByText("No incidents")).toBeInTheDocument();
    unmount();

    mockGetIncidents.mockRejectedValue(new Error("Rootly unavailable"));
    render(<IncidentsTable />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Rootly unavailable",
    );
  });

  it("refetches for search and pagination", async () => {
    const user = userEvent.setup();
    render(<IncidentsTable />);
    await waitFor(() => expect(mockGetIncidents).toHaveBeenCalledTimes(1));

    await user.type(screen.getByLabelText("Search Incidents"), "payments");
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith({
        filter: { search: "payments", ...hideTestIncidents },
        page: { number: 1, size: 10 },
        sort: "-started_at",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith(
        expect.objectContaining({
          filter: { search: "payments", ...hideTestIncidents },
          page: { number: 2, size: 10 },
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Show 25" }));
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: { number: 2, size: 25 } }),
      ),
    );
  });
});
