import type { RootlyApi } from "@rootly/backstage-plugin-common";
import { loadIncidentFilterOptions } from "./filterOptions";

const named = (id: string, name: string) => ({ id, attributes: { name } });

const createClient = () => ({
  getTeams: jest.fn().mockResolvedValue({ data: [named("t1", "SRE")] }),
  getServices: jest
    .fn()
    .mockResolvedValue({ data: [named("s1", "Payments")] }),
  getSeverities: jest
    .fn()
    .mockResolvedValue({ data: [named("sev1", "SEV1")] }),
  getEnvironments: jest
    .fn()
    .mockResolvedValue({ data: [named("env1", "Production")] }),
});

describe("loadIncidentFilterOptions", () => {
  it("filters static statuses by the search term", async () => {
    const client = createClient() as unknown as RootlyApi;
    await expect(
      loadIncidentFilterOptions(client, "status", "resol"),
    ).resolves.toEqual([{ id: "resolved", label: "Resolved" }]);
  });

  it("searches teams and services through the Rootly client", async () => {
    const client = createClient();
    await expect(
      loadIncidentFilterOptions(client as unknown as RootlyApi, "teams", "sr"),
    ).resolves.toEqual([{ id: "t1", label: "SRE" }]);
    expect(client.getTeams).toHaveBeenCalledWith({
      page: { size: 50 },
      filter: { search: "sr" },
    });
    await expect(
      loadIncidentFilterOptions(
        client as unknown as RootlyApi,
        "services",
        "",
      ),
    ).resolves.toEqual([{ id: "s1", label: "Payments" }]);
  });

  it("loads severities and environments through the Rootly client", async () => {
    const client = createClient();
    await expect(
      loadIncidentFilterOptions(
        client as unknown as RootlyApi,
        "severity",
        "sev",
      ),
    ).resolves.toEqual([{ id: "sev1", label: "SEV1" }]);
    expect(client.getSeverities).toHaveBeenCalledWith({
      page: { size: 50 },
      filter: { search: "sev" },
    });

    await expect(
      loadIncidentFilterOptions(
        client as unknown as RootlyApi,
        "environments",
        "",
      ),
    ).resolves.toEqual([{ id: "env1", label: "Production" }]);
    expect(client.getEnvironments).toHaveBeenCalledWith({
      page: { size: 50 },
      filter: { search: "" },
    });
  });

  it("returns no options when a custom client lacks the lookup", async () => {
    await expect(
      loadIncidentFilterOptions({} as RootlyApi, "environments", ""),
    ).resolves.toEqual([]);
  });
});
