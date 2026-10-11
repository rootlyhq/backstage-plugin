import type { RootlyApi } from "@rootly/backstage-plugin-common";
import { loadIncidentFilterOptions } from "./filterOptions";

const named = (id: string, name: string) => ({ id, attributes: { name } });

const createClient = () => ({
  getTeams: jest.fn().mockResolvedValue({ data: [named("t1", "SRE")] }),
  getServices: jest
    .fn()
    .mockResolvedValue({ data: [named("s1", "Payments")] }),
  fetch: jest.fn().mockResolvedValue({ data: [named("sev1", "SEV1")] }),
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

  it("loads severities and environments from their endpoints", async () => {
    const client = createClient();
    await expect(
      loadIncidentFilterOptions(
        client as unknown as RootlyApi,
        "severity",
        "sev",
      ),
    ).resolves.toEqual([{ id: "sev1", label: "SEV1" }]);
    expect(client.fetch).toHaveBeenCalledWith(
      "/v1/severities?page%5Bsize%5D=50&filter%5Bsearch%5D=sev",
      expect.anything(),
    );

    await loadIncidentFilterOptions(
      client as unknown as RootlyApi,
      "environments",
      "",
    );
    expect(client.fetch).toHaveBeenLastCalledWith(
      "/v1/environments?page%5Bsize%5D=50",
      expect.anything(),
    );
  });

  it("returns no options when the client cannot fetch arbitrary resources", async () => {
    await expect(
      loadIncidentFilterOptions({} as RootlyApi, "environments", ""),
    ).resolves.toEqual([]);
  });
});
