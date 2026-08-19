/** @jsxRuntime automatic */
import type { RootlyService } from "@rootly/backstage-plugin-common";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { ServicesTable } from "./ServicesTable";

const mockGetServices = jest.fn();
const mockGetServiceDetailsURL = jest.fn();
const mockUseRootlyClient = jest.fn();

jest.mock("../../api", () => ({
  useRootlyClient: (options: unknown) => mockUseRootlyClient(options),
}));
jest.mock("@material-ui/core", () => ({
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
    isLoading,
    onPageChange,
    onRowsPerPageChange,
  }: {
    columns: Array<{
      field: string;
      render?: (row: RootlyService) => ReactNode;
    }>;
    data: RootlyService[];
    emptyContent: ReactNode;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (size: number) => void;
  }) => (
    <div>
      {isLoading && <div>Loading services</div>}
      {!isLoading && data.length === 0 && emptyContent}
      {data.map((row) => (
        <div key={row.id}>
          {columns.map((column) => (
            <div key={column.field}>
              {column.render?.(row) ??
                String(
                  row.attributes[
                    column.field.replace(
                      "attributes.",
                      "",
                    ) as keyof typeof row.attributes
                  ] ?? "",
                )}
            </div>
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

const service = (backstageId?: string): RootlyService =>
  ({
    id: "service-id",
    type: "services",
    attributes: {
      backstage_id: backstageId,
      created_at: "2026-01-01T00:00:00Z",
      description: "Service description",
      incidents_count: 2,
      name: "Payments",
      updated_at: "2026-01-02T00:00:00Z",
    },
  }) as unknown as RootlyService;

const response = (data: RootlyService[]) => ({
  data,
  meta: { total_count: data.length },
});

describe("ServicesTable", () => {
  beforeEach(() => {
    mockGetServices.mockReset();
    mockGetServiceDetailsURL.mockReset();
    mockGetServices.mockResolvedValue(response([]));
    mockGetServiceDetailsURL.mockReturnValue(
      "https://rootly.example/services/service-id",
    );
    mockUseRootlyClient.mockReturnValue({
      getServiceDetailsURL: mockGetServiceDetailsURL,
      getServices: mockGetServices,
    });
  });

  it("passes organization, filters, and default pagination to Rootly", async () => {
    render(
      <ServicesTable
        organizationId="organization-id"
        params={{ filter: { status: "operational" } }}
      />,
    );

    await waitFor(() => expect(mockGetServices).toHaveBeenCalled());
    expect(mockUseRootlyClient).toHaveBeenCalledWith({
      organizationId: "organization-id",
    });
    expect(mockGetServices).toHaveBeenLastCalledWith({
      filter: { search: "", status: "operational" },
      page: { number: 1, size: 10 },
    });
  });

  it("renders returned services and their Rootly links", async () => {
    mockGetServices.mockResolvedValue(response([service()]));

    render(<ServicesTable />);

    expect(await screen.findByText("Payments")).toHaveAttribute(
      "href",
      "https://rootly.example/services/service-id",
    );
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders a Backstage entity link for a valid reference", async () => {
    mockGetServices.mockResolvedValue(
      response([service("component:default/payments")]),
    );

    render(<ServicesTable />);

    expect(
      await screen.findByText("Backstage entity payments"),
    ).toBeInTheDocument();
  });

  it("falls back safely for a malformed Backstage entity reference", async () => {
    mockGetServices.mockResolvedValue(response([service(":not-valid")]));

    render(<ServicesTable />);

    expect(await screen.findByText("N/A")).toBeInTheDocument();
  });

  it("renders the empty state", async () => {
    render(<ServicesTable />);

    expect(await screen.findByText("No services")).toBeInTheDocument();
  });

  it("renders API errors", async () => {
    mockGetServices.mockRejectedValue(new Error("Rootly unavailable"));

    render(<ServicesTable />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Rootly unavailable",
    );
  });

  it("refetches when the user searches", async () => {
    const user = userEvent.setup();
    render(<ServicesTable />);
    await waitFor(() => expect(mockGetServices).toHaveBeenCalledTimes(1));

    await user.type(screen.getByLabelText("Search Services"), "payments");

    await waitFor(() =>
      expect(mockGetServices).toHaveBeenLastCalledWith({
        filter: { search: "payments" },
        page: { number: 1, size: 10 },
      }),
    );
  });

  it("refetches when pagination changes", async () => {
    render(<ServicesTable />);
    await waitFor(() => expect(mockGetServices).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    await waitFor(() =>
      expect(mockGetServices).toHaveBeenLastCalledWith({
        filter: { search: "" },
        page: { number: 2, size: 10 },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Show 25" }));
    await waitFor(() =>
      expect(mockGetServices).toHaveBeenLastCalledWith({
        filter: { search: "" },
        page: { number: 2, size: 25 },
      }),
    );
  });
});
