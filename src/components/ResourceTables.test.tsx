/** @jsxRuntime automatic */
import type {
  RootlyFunctionality,
  RootlyTeam,
} from "@rootly/backstage-plugin-common";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentType, ReactNode } from "react";

import { FunctionalitiesTable } from "./FunctionalitiesTable/FunctionalitiesTable";
import { TeamsTable } from "./TeamsTable/TeamsTable";

type Resource = RootlyFunctionality | RootlyTeam;
type TableProps = { organizationId?: string; params?: { filter?: object } };

const mockGetFunctionalities = jest.fn();
const mockGetFunctionalityDetailsURL = jest.fn();
const mockGetTeams = jest.fn();
const mockGetTeamDetailsURL = jest.fn();
const mockUseRootlyClient = jest.fn();

jest.mock("../api", () => ({
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
    onPageChange,
    onRowsPerPageChange,
  }: {
    columns: Array<{
      field: string;
      render?: (row: Resource) => ReactNode;
    }>;
    data: Resource[];
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

const resource = (type: "teams" | "functionalities"): Resource =>
  ({
    id: `${type}-id`,
    type,
    attributes: {
      backstage_id: `component:default/${type}`,
      created_at: "2026-01-01T00:00:00Z",
      description: `${type} description`,
      incidents_count: 2,
      name: type === "teams" ? "Reliability" : "Checkout",
      updated_at: "2026-01-02T00:00:00Z",
    },
  }) as unknown as Resource;

const response = (data: Resource[]) => ({
  data,
  meta: { total_count: data.length },
});

const cases: Array<{
  api: jest.Mock;
  component: ComponentType<TableProps>;
  details: jest.Mock;
  empty: string;
  name: string;
  placeholder: string;
  type: "teams" | "functionalities";
}> = [
  {
    api: mockGetTeams,
    component: TeamsTable,
    details: mockGetTeamDetailsURL,
    empty: "No teams",
    name: "Reliability",
    placeholder: "Search Teams",
    type: "teams",
  },
  {
    api: mockGetFunctionalities,
    component: FunctionalitiesTable,
    details: mockGetFunctionalityDetailsURL,
    empty: "No functionalities",
    name: "Checkout",
    placeholder: "Search Functionalities",
    type: "functionalities",
  },
];

describe.each(cases)("$type table", (testCase) => {
  const TableComponent = testCase.component;

  beforeEach(() => {
    mockGetTeams.mockReset().mockResolvedValue(response([]));
    mockGetFunctionalities.mockReset().mockResolvedValue(response([]));
    mockGetTeamDetailsURL.mockReset().mockReturnValue("https://rootly/team");
    mockGetFunctionalityDetailsURL
      .mockReset()
      .mockReturnValue("https://rootly/functionality");
    mockUseRootlyClient.mockReset().mockReturnValue({
      getFunctionalities: mockGetFunctionalities,
      getFunctionalityDetailsURL: mockGetFunctionalityDetailsURL,
      getTeams: mockGetTeams,
      getTeamDetailsURL: mockGetTeamDetailsURL,
    });
  });

  it("passes organization, filters, and pagination to Rootly", async () => {
    render(
      <TableComponent
        organizationId="organization-id"
        params={{ filter: { status: "active" } }}
      />,
    );

    await waitFor(() => expect(testCase.api).toHaveBeenCalled());
    expect(mockUseRootlyClient).toHaveBeenCalledWith({
      organizationId: "organization-id",
    });
    expect(testCase.api).toHaveBeenLastCalledWith({
      filter: { search: "", status: "active" },
      page: { number: 1, size: 10 },
    });
  });

  it("renders Rootly and Backstage links", async () => {
    testCase.api.mockResolvedValue(response([resource(testCase.type)]));

    render(<TableComponent />);

    expect(await screen.findByText(testCase.name)).toHaveAttribute(
      "href",
      expect.stringContaining("https://rootly/"),
    );
    expect(
      screen.getByText(`Backstage entity ${testCase.type}`),
    ).toBeInTheDocument();
  });

  it("renders empty and error states", async () => {
    const { unmount } = render(<TableComponent />);
    expect(await screen.findByText(testCase.empty)).toBeInTheDocument();
    unmount();

    testCase.api.mockRejectedValue(new Error("Rootly unavailable"));
    render(<TableComponent />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Rootly unavailable",
    );
  });

  it("refetches for search and pagination", async () => {
    const user = userEvent.setup();
    render(<TableComponent />);
    await waitFor(() => expect(testCase.api).toHaveBeenCalledTimes(1));

    await user.type(screen.getByLabelText(testCase.placeholder), "critical");
    await waitFor(() =>
      expect(testCase.api).toHaveBeenLastCalledWith({
        filter: { search: "critical" },
        page: { number: 1, size: 10 },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    await waitFor(() =>
      expect(testCase.api).toHaveBeenLastCalledWith({
        filter: { search: "critical" },
        page: { number: 2, size: 10 },
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Show 25" }));
    await waitFor(() =>
      expect(testCase.api).toHaveBeenLastCalledWith({
        filter: { search: "critical" },
        page: { number: 2, size: 25 },
      }),
    );
  });
});
