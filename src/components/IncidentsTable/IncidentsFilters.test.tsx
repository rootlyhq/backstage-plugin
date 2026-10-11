/** @jsxRuntime automatic */
import type { RootlyApi } from "@rootly/backstage-plugin-common";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { IncidentsFilters } from "./IncidentsFilters";
import { EMPTY_INCIDENT_FILTERS } from "./incidentsQuery";

const client = {
  getTeams: jest.fn().mockResolvedValue({
    data: [{ id: "team-1", attributes: { name: "SRE" } }],
  }),
} as unknown as RootlyApi;

describe("IncidentsFilters", () => {
  it("renders the available filters and selects an option", async () => {
    const onFiltersChange = jest.fn();
    render(
      <IncidentsFilters
        client={client}
        available={["status", "teams"]}
        filters={EMPTY_INCIDENT_FILTERS}
        onFiltersChange={onFiltersChange}
        showTestIncidents={false}
        onShowTestIncidentsChange={jest.fn()}
      />,
    );

    expect(screen.queryByLabelText("Severity")).not.toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText("Teams"));
    fireEvent.click(await screen.findByText("SRE"));

    await waitFor(() =>
      expect(onFiltersChange).toHaveBeenCalledWith({
        ...EMPTY_INCIDENT_FILTERS,
        teams: [{ id: "team-1", label: "SRE" }],
      }),
    );
  });

  it("toggles test incidents and clears filters", () => {
    const onFiltersChange = jest.fn();
    const onShowTestIncidentsChange = jest.fn();
    render(
      <IncidentsFilters
        client={client}
        available={["status", "teams", "services"]}
        filters={{
          ...EMPTY_INCIDENT_FILTERS,
          teams: [{ id: "team-1", label: "SRE" }],
          services: [{ id: "svc-1", label: "Payments" }],
        }}
        onFiltersChange={onFiltersChange}
        showTestIncidents={false}
        onShowTestIncidentsChange={onShowTestIncidentsChange}
      />,
    );

    expect(
      screen.getByText(/match incidents linked to any of the selected items/),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Show test incidents"));
    expect(onShowTestIncidentsChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onFiltersChange).toHaveBeenCalledWith(EMPTY_INCIDENT_FILTERS);
  });
});
