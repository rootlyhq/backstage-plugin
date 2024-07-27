class IncidentWrapper {
  incident;
  included;
  constructor(incident, included) {
    this.incident = incident;
    this.included = included;
  }
  environments = () => {
    if (this.incident.relationships?.environments?.data) {
      const ids = this.incident.relationships?.environments?.data.map((r) => {
        return r.id;
      });
      return this.included?.filter((i) => {
        return i.type === "environments" && ids.includes(i.id);
      });
    }
    return [];
  };
  services = () => {
    if (this.incident.relationships?.services?.data) {
      const ids = this.incident.relationships?.services?.data.map((r) => {
        return r.id;
      });
      return this.included?.filter((i) => {
        return i.type === "services" && ids.includes(i.id);
      });
    }
    return [];
  };
  functionalities = () => {
    if (this.incident.relationships?.functionalities?.data) {
      const ids = this.incident.relationships?.functionalities?.data.map((r) => {
        return r.id;
      });
      return this.included?.filter((i) => {
        return i.type === "functionalities" && ids.includes(i.id);
      });
    }
    return [];
  };
  groups = () => {
    if (this.incident.relationships?.groups?.data) {
      const ids = this.incident.relationships?.groups?.data.map((r) => {
        return r.id;
      });
      return this.included?.filter((i) => {
        return i.type === "groups" && ids.includes(i.id);
      });
    }
    return [];
  };
  types = () => {
    if (this.incident.relationships?.incident_types?.data) {
      const ids = this.incident.relationships?.incident_types?.data.map((r) => {
        return r.id;
      });
      return this.included?.filter((i) => {
        return i.type === "incident_types" && ids.includes(i.id);
      });
    }
    return [];
  };
}

export { IncidentWrapper };
//# sourceMappingURL=index.esm.js.map
