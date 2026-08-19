/** @jsxRuntime automatic */
import type { RootlyIncident } from "@rootly/backstage-plugin-common";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { IncidentsTable } from "./IncidentsTable";

const mockGetIncidents = jest.fn();
const mockUseRootlyClient = jest.fn();

jest.mock("../../api", () => ({
  useRootlyClient: (options: unknown) => mockUseRootlyClient(options),
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
  makeStyles: () => () => ({ empty: "empty", searchContainer: "search" }),
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
      render?: (row: unknown) => ReactNode;
    }>;
    data: unknown[];
    emptyContent: ReactNode;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (size: number) => void;
  }) => (
    <div>
      {data.length === 0 && emptyContent}
      {data.map((row, rowIndex) => (
        <div key={rowIndex}>
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

describe("IncidentsTable", () => {
  beforeEach(() => {
    mockGetIncidents.mockReset().mockResolvedValue(response([]));
    mockUseRootlyClient.mockReset().mockReturnValue({
      getIncidents: mockGetIncidents,
    });
  });

  it("passes organization, filters, and pagination to Rootly", async () => {
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
    expect(mockGetIncidents).toHaveBeenLastCalledWith({
      filter: { search: "", status: "started" },
      page: { number: 1, size: 10 },
    });
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
        filter: { search: "payments" },
        page: { number: 1, size: 10 },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith({
        filter: { search: "payments" },
        page: { number: 2, size: 10 },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Show 25" }));
    await waitFor(() =>
      expect(mockGetIncidents).toHaveBeenLastCalledWith({
        filter: { search: "payments" },
        page: { number: 2, size: 25 },
      }),
    );
  });
});
