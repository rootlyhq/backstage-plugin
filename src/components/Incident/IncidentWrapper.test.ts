import type { RootlyIncident } from "@rootly/backstage-plugin-common";

import { IncidentWrapper } from ".";

const relationships = {
  environments: { data: [{ id: "environment-1" }] },
  services: { data: [{ id: "service-1" }] },
  functionalities: { data: [{ id: "functionality-1" }] },
  groups: { data: [{ id: "group-1" }] },
  incident_types: { data: [{ id: "type-1" }] },
};

const incident = { relationships } as unknown as RootlyIncident;
const included = [
  { id: "environment-1", type: "environments" },
  { id: "service-1", type: "services" },
  { id: "functionality-1", type: "functionalities" },
  { id: "group-1", type: "groups" },
  { id: "type-1", type: "incident_types" },
  { id: "service-1", type: "groups" },
  { id: "unrelated", type: "services" },
];

describe("IncidentWrapper", () => {
  it.each([
    ["environments", "environments", "environment-1"],
    ["services", "services", "service-1"],
    ["functionalities", "functionalities", "functionality-1"],
    ["groups", "groups", "group-1"],
    ["types", "incident_types", "type-1"],
  ] as const)(
    "resolves the %s relationship from included resources",
    (method, type, id) => {
      const wrapper = new IncidentWrapper(incident, included);

      expect(wrapper[method]()).toEqual([{ id, type }]);
    },
  );

  it("returns empty arrays when relationships are absent", () => {
    const wrapper = new IncidentWrapper({} as RootlyIncident, included);

    expect(wrapper.environments()).toEqual([]);
    expect(wrapper.services()).toEqual([]);
    expect(wrapper.functionalities()).toEqual([]);
    expect(wrapper.groups()).toEqual([]);
    expect(wrapper.types()).toEqual([]);
  });

  it("returns empty arrays when included resources are absent", () => {
    const wrapper = new IncidentWrapper(incident, undefined);

    expect(wrapper.environments()).toEqual([]);
    expect(wrapper.services()).toEqual([]);
    expect(wrapper.functionalities()).toEqual([]);
    expect(wrapper.groups()).toEqual([]);
    expect(wrapper.types()).toEqual([]);
  });
});
