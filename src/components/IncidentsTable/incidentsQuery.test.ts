import {
  availableIncidentFilters,
  buildIncidentsQuery,
  EMPTY_INCIDENT_FILTERS,
  toIncidentsSortParam,
} from "./incidentsQuery";

const page = { number: 1, size: 10 };

describe("toIncidentsSortParam", () => {
  it("maps sortable columns to the Rootly sort param", () => {
    expect(
      toIncidentsSortParam({
        field: "incident.attributes.started_at",
        direction: "asc",
      }),
    ).toBe("started_at");
    expect(
      toIncidentsSortParam({
        field: "incident.attributes.mitigated_at",
        direction: "desc",
      }),
    ).toBe("-mitigated_at");
  });

  it("falls back to newest started first", () => {
    expect(toIncidentsSortParam()).toBe("-started_at");
    expect(toIncidentsSortParam({ field: "title", direction: "asc" })).toBe(
      "-started_at",
    );
  });
});

describe("availableIncidentFilters", () => {
  it("offers every filter without a scope", () => {
    expect(availableIncidentFilters()).toEqual([
      "status",
      "severity",
      "teams",
      "services",
      "environments",
    ]);
  });

  it("hides filters the scope already sets, and relationship filters on scoped pages", () => {
    expect(
      availableIncidentFilters({ services: "payments", status: "started" }),
    ).toEqual(["severity"]);
    expect(availableIncidentFilters({ severity: "sev0" })).toEqual([
      "status",
      "teams",
      "services",
      "environments",
    ]);
  });

  it("ignores empty scope values", () => {
    expect(
      availableIncidentFilters({ status: undefined, services: "" }),
    ).toHaveLength(5);
  });
});

describe("buildIncidentsQuery", () => {
  it("sends filters, search, sort and the test incident exclusion", () => {
    expect(
      buildIncidentsQuery({
        params: { include: "services" },
        search: "db",
        filters: {
          ...EMPTY_INCIDENT_FILTERS,
          status: [
            { id: "started", label: "Started" },
            { id: "mitigated", label: "Mitigated" },
          ],
          services: [{ id: "svc-1", label: "Payments" }],
        },
        page,
        sort: { field: "incident.attributes.resolved_at", direction: "desc" },
        showTestIncidents: false,
      }),
    ).toEqual({
      include: "services",
      filter: {
        search: "db",
        status: "started,mitigated",
        service_ids: "svc-1",
        kind: { not_in: "test,test_sub" },
      },
      page,
      sort: "-resolved_at",
    });
  });

  it("lets the scope win over user filters and keeps a scoped kind", () => {
    expect(
      buildIncidentsQuery({
        params: {
          filter: {
            services: "payments",
            status: "started",
            kind: "test",
            teams: undefined,
          },
        },
        filters: {
          ...EMPTY_INCIDENT_FILTERS,
          status: [{ id: "resolved", label: "Resolved" }],
          teams: [{ id: "team-1", label: "SRE" }],
        },
        page,
        showTestIncidents: false,
      }).filter,
    ).toEqual({
      search: undefined,
      services: "payments",
      status: "started",
      kind: "test",
    });
  });

  it("includes test incidents when requested", () => {
    expect(
      buildIncidentsQuery({ page, showTestIncidents: true }).filter,
    ).toEqual({ search: undefined });
  });
});
