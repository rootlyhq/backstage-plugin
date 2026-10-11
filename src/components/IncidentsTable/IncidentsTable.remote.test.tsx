/** @jsxRuntime automatic */
import { renderInTestApp } from "@backstage/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { IncidentsTable } from "./IncidentsTable";

// Exercises the real Backstage/Material Table remote data flow end to end.
const mockGetIncidents = jest.fn();
const mockClient = {
  getIncidents: (...args: unknown[]) => mockGetIncidents(...args),
};

jest.mock("../../api", () => ({
  useRootlyClient: () => mockClient,
  useRootlyInstanceSettings: () => ({ showTestIncidents: false }),
}));
jest.mock("../UI/ColoredChips", () => ({ ColoredChips: () => null }));
jest.mock("@backstage/plugin-search-react", () => ({
  SearchBarBase: () => null,
}));

const lastQuery = () => mockGetIncidents.mock.calls.at(-1)[0];

const sortLabel = (title: string) =>
  screen.getByText(title).closest(".MuiTableSortLabel-root") as HTMLElement;

describe("IncidentsTable with Material Table remote data", () => {
  beforeEach(() => {
    mockGetIncidents.mockReset().mockResolvedValue({
      data: [
        {
          id: "1",
          type: "incidents",
          attributes: {
            title: "Database outage",
            url: "https://rootly.example/incidents/1",
            status: "started",
            started_at: "2026-01-01T00:00:00Z",
          },
          relationships: {},
        },
      ],
      included: [],
      meta: { total_count: 30 },
    });
  });

  it("sorts and paginates on the server across all pages", async () => {
    await renderInTestApp(<IncidentsTable />);

    expect(await screen.findByText("Database outage")).toBeInTheDocument();
    expect(lastQuery()).toMatchObject({
      page: { number: 1, size: 10 },
      sort: "-started_at",
    });
    expect(screen.getByText("Title").closest(".MuiTableSortLabel-root")).toBeNull();

    fireEvent.click(screen.getByText("Resolved At"));
    await waitFor(() =>
      expect(sortLabel("Resolved At")).toHaveClass("MuiTableSortLabel-active"),
    );
    expect(lastQuery().sort).toBe("-resolved_at");

    fireEvent.click(screen.getByText("Resolved At"));
    await waitFor(() => expect(lastQuery().sort).toBe("resolved_at"));
    await waitFor(() =>
      expect(
        sortLabel("Resolved At").querySelector(
          ".MuiTableSortLabel-iconDirectionAsc",
        ),
      ).not.toBeNull(),
    );

    fireEvent.click(screen.getByLabelText("Next Page"));
    await waitFor(() =>
      expect(lastQuery()).toMatchObject({
        page: { number: 2, size: 10 },
        sort: "resolved_at",
      }),
    );
  });
});
