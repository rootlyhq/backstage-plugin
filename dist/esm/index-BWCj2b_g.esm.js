import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension, createComponentExtension, useApi } from '@backstage/core-plugin-api';
import { stringifyEntityRef, parseEntityRef } from '@backstage/catalog-model';
import qs from 'qs';
import { Table } from '@backstage/core-components';
import { Tooltip, Chip, withStyles, makeStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useState, useCallback } from 'react';
import { useAsync } from 'react-use';
import { EntityRefLink } from '@backstage/plugin-catalog-react';

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const RootlyApiRef = createApiRef({
  id: "plugin.rootly.service"
});
const DEFAULT_PROXY_PATH = "/rootly/api";
class RootlyApi {
  constructor(opts) {
    __publicField$1(this, "discoveryApi");
    __publicField$1(this, "identityApi");
    __publicField$1(this, "proxyPath");
    __publicField$1(this, "domain");
    var _a;
    this.discoveryApi = opts.discoveryApi;
    this.identityApi = opts.identityApi;
    this.domain = opts.domain;
    this.proxyPath = (_a = opts.proxyPath) != null ? _a : DEFAULT_PROXY_PATH;
  }
  async fetch(input, init) {
    const apiUrl = await this.apiUrl();
    const authedInit = await this.addAuthHeaders(init || {});
    const resp = await fetch(`${apiUrl}${input}`, authedInit);
    if (!resp.ok) {
      throw new Error(`Request failed with ${resp.status} ${resp.statusText}`);
    }
    return await resp.json();
  }
  async call(input, init) {
    const apiUrl = await this.apiUrl();
    const authedInit = await this.addAuthHeaders(init || {});
    const resp = await fetch(`${apiUrl}${input}`, authedInit);
    if (!resp.ok)
      throw new Error(`Request failed with ${resp.status}: ${resp.statusText}`);
  }
  async getService(id_or_slug) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const response = await this.fetch(
      `/v1/services/${id_or_slug}`,
      init
    );
    return response;
  }
  async getServices(opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(
      `/v1/services?${params}`,
      init
    );
    return response;
  }
  async getFunctionality(id_or_slug) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const response = await this.fetch(
      `/v1/functionalities/${id_or_slug}`,
      init
    );
    return response;
  }
  async getFunctionalities(opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(
      `/v1/functionalities?${params}`,
      init
    );
    return response;
  }
  async getTeam(id_or_slug) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const response = await this.fetch(
      `/v1/teams/${id_or_slug}`,
      init
    );
    return response;
  }
  async getTeams(opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(
      `/v1/teams?${params}`,
      init
    );
    return response;
  }
  async getIncidents(opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(
      `/v1/incidents?${params}`,
      init
    );
    return response;
  }
  async getServiceIncidentsChart(service, opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(
      `/v1/services/${service.id}/incidents_chart?${params}`,
      init
    );
    return response;
  }
  async getFunctionalityIncidentsChart(functionality, opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(
      `/v1/functionalities/${functionality.id}/incidents_chart?${params}`,
      init
    );
    return response;
  }
  async getTeamIncidentsChart(team, opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(
      `/v1/teams/${team.id}/incidents_chart?${params}`,
      init
    );
    return response;
  }
  async importServiceEntity(entity) {
    var _a;
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    const init = {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "services",
          attributes: {
            name: entity.metadata.name,
            description: entity.metadata.description,
            backstage_id: entityTriplet,
            pagerduty_id: (_a = entity.metadata.annotations) == null ? void 0 : _a["pagerduty.com/service-id"]
          }
        }
      })
    };
    await this.call(`/v1/services`, init);
  }
  async updateServiceEntity(entity, service, old_service) {
    var _a;
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    if (old_service == null ? void 0 : old_service.id) {
      const init1 = {
        method: "PUT",
        headers: { "Content-Type": "application/vnd.api+json" },
        body: JSON.stringify({
          data: {
            type: "services",
            attributes: {
              backstage_id: null
            }
          }
        })
      };
      await this.call(`/v1/services/${old_service.id}`, init1);
    }
    const init2 = {
      method: "PUT",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "services",
          attributes: {
            backstage_id: entityTriplet,
            pagerduty_id: (_a = entity.metadata.annotations) == null ? void 0 : _a["pagerduty.com/service-id"]
          }
        }
      })
    };
    await this.call(`/v1/services/${service.id}`, init2);
  }
  async deleteServiceEntity(service) {
    const init = {
      method: "PUT",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "services",
          attributes: {
            backstage_id: null
          }
        }
      })
    };
    await this.call(`/v1/services/${service.id}`, init);
  }
  async importFunctionalityEntity(entity) {
    var _a;
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    const init = {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "functionalities",
          attributes: {
            name: entity.metadata.name,
            description: entity.metadata.description,
            backstage_id: entityTriplet,
            pagerduty_id: (_a = entity.metadata.annotations) == null ? void 0 : _a["pagerduty.com/service-id"]
          }
        }
      })
    };
    await this.call(`/v1/functionalities`, init);
  }
  async updateFunctionalityEntity(entity, functionality, old_functionality) {
    var _a;
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    if (old_functionality == null ? void 0 : old_functionality.id) {
      const init1 = {
        method: "PUT",
        headers: { "Content-Type": "application/vnd.api+json" },
        body: JSON.stringify({
          data: {
            type: "functionalities",
            attributes: {
              backstage_id: null
            }
          }
        })
      };
      await this.call(`/v1/functionalities/${old_functionality.id}`, init1);
    }
    const init2 = {
      method: "PUT",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "functionalities",
          attributes: {
            backstage_id: entityTriplet,
            pagerduty_id: (_a = entity.metadata.annotations) == null ? void 0 : _a["pagerduty.com/service-id"]
          }
        }
      })
    };
    await this.call(`/v1/functionalities/${functionality.id}`, init2);
  }
  async deleteFunctionalityEntity(functionality) {
    const init = {
      method: "PUT",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "functionalities",
          attributes: {
            backstage_id: null
          }
        }
      })
    };
    await this.call(`/v1/functionalities/${functionality.id}`, init);
  }
  async importTeamEntity(entity) {
    var _a;
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    const init = {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "teams",
          attributes: {
            name: entity.metadata.name,
            description: entity.metadata.description,
            backstage_id: entityTriplet,
            pagerduty_id: (_a = entity.metadata.annotations) == null ? void 0 : _a["pagerduty.com/service-id"]
          }
        }
      })
    };
    await this.call(`/v1/teams`, init);
  }
  async updateTeamEntity(entity, team, old_team) {
    var _a;
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    if (old_team == null ? void 0 : old_team.id) {
      const init1 = {
        method: "PUT",
        headers: { "Content-Type": "application/vnd.api+json" },
        body: JSON.stringify({
          data: {
            type: "teams",
            attributes: {
              backstage_id: null
            }
          }
        })
      };
      await this.call(`/v1/teams/${old_team.id}`, init1);
    }
    const init2 = {
      method: "PUT",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "teams",
          attributes: {
            backstage_id: entityTriplet,
            pagerduty_id: (_a = entity.metadata.annotations) == null ? void 0 : _a["pagerduty.com/service-id"]
          }
        }
      })
    };
    await this.call(`/v1/teams/${team.id}`, init2);
  }
  async deleteTeamEntity(team) {
    const init = {
      method: "PUT",
      headers: { "Content-Type": "application/vnd.api+json" },
      body: JSON.stringify({
        data: {
          type: "teams",
          attributes: {
            backstage_id: null
          }
        }
      })
    };
    await this.call(`/v1/teams/${team.id}`, init);
  }
  getCreateIncidentURL() {
    return `${this.domain}/account/incidents/new`;
  }
  getListIncidents() {
    return `${this.domain}/account/incidents`;
  }
  getListIncidentsForServiceURL(service) {
    const params = qs.stringify(
      { filter: { filters: [{ services: [service.id] }] } },
      { arrayFormat: "brackets" }
    );
    return `${this.domain}/account/incidents?${params}`;
  }
  getListIncidentsForFunctionalityURL(functionality) {
    const params = qs.stringify(
      { filter: { filters: [{ functionalities: [functionality.id] }] } },
      { arrayFormat: "brackets" }
    );
    return `${this.domain}/account/incidents?${params}`;
  }
  getListIncidentsForTeamURL(team) {
    const params = qs.stringify(
      { filter: { filters: [{ groups: [team.id] }] } },
      { arrayFormat: "brackets" }
    );
    return `${this.domain}/account/incidents?${params}`;
  }
  getServiceDetailsURL(service) {
    return `${this.domain}/account/services/${service.attributes.slug}`;
  }
  getFunctionalityDetailsURL(functionality) {
    return `${this.domain}/account/functionalities/${functionality.attributes.slug}`;
  }
  getTeamDetailsURL(team) {
    return `${this.domain}/account/teams/${team.attributes.slug}`;
  }
  async apiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl("proxy");
    return proxyUrl + this.proxyPath;
  }
  async addAuthHeaders(init) {
    const { token } = await this.identityApi.getCredentials();
    const headers = init.headers || {};
    return {
      ...init,
      headers: {
        ...headers,
        ...token ? { Authorization: `Bearer ${token}` } : {}
      }
    };
  }
}

const RootlyRouteRef = createRouteRef({
  id: "Rootly"
});
const RootlyPlugin = createPlugin({
  id: "Rootly",
  apis: [
    createApiFactory({
      api: RootlyApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => {
        return new RootlyApi({
          discoveryApi,
          identityApi,
          domain: "https://rootly.com"
        });
      }
    })
  ],
  routes: {
    explore: RootlyRouteRef
  }
});

const RootlyPage = RootlyPlugin.provide(
  createRoutableExtension({
    name: "RootlyPage",
    component: () => import('./index-DatimJu6.esm.js').then((m) => m.RootlyPage),
    mountPoint: RootlyRouteRef
  })
);
const RootlyOverviewCard = RootlyPlugin.provide(
  createComponentExtension({
    name: "RootlyOverviewCard",
    component: {
      lazy: () => import('./index-BUWY6Xa3.esm.js').then((m) => m.RootlyOverviewCard)
    }
  })
);
const RootlyIncidentsPage = RootlyPlugin.provide(
  createComponentExtension({
    name: "RootlyIncidentsPage",
    component: {
      lazy: () => import('./index-CsuV9Gz3.esm.js').then((m) => m.RootlyIncidentsPage)
    }
  })
);

const ROOTLY_ANNOTATION_SERVICE_ID = "rootly.com/service-id";
const ROOTLY_ANNOTATION_SERVICE_SLUG = "rootly.com/service-slug";
const ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT = "rootly.com/service-auto-import";
const ROOTLY_ANNOTATION_FUNCTIONALITY_ID = "rootly.com/functionality-id";
const ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG = "rootly.com/functionality-slug";
const ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT = "rootly.com/functionality-auto-import";
const ROOTLY_ANNOTATION_TEAM_ID = "rootly.com/team-id";
const ROOTLY_ANNOTATION_TEAM_SLUG = "rootly.com/team-slug";
const ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT = "rootly.com/team-auto-import";
const isRootlyAvailable = (entity) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_SERVICE_ID]) && Boolean((_b = entity.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_SERVICE_ID]) || Boolean((_c = entity.metadata.annotations) == null ? void 0 : _c[ROOTLY_ANNOTATION_SERVICE_SLUG]) && Boolean((_d = entity.metadata.annotations) == null ? void 0 : _d[ROOTLY_ANNOTATION_SERVICE_SLUG]) || Boolean((_e = entity.metadata.annotations) == null ? void 0 : _e[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) && Boolean((_f = entity.metadata.annotations) == null ? void 0 : _f[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) || Boolean((_g = entity.metadata.annotations) == null ? void 0 : _g[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]) && Boolean((_h = entity.metadata.annotations) == null ? void 0 : _h[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]) || Boolean((_i = entity.metadata.annotations) == null ? void 0 : _i[ROOTLY_ANNOTATION_TEAM_ID]) && Boolean((_j = entity.metadata.annotations) == null ? void 0 : _j[ROOTLY_ANNOTATION_TEAM_ID]) || Boolean((_k = entity.metadata.annotations) == null ? void 0 : _k[ROOTLY_ANNOTATION_TEAM_SLUG]) && Boolean((_l = entity.metadata.annotations) == null ? void 0 : _l[ROOTLY_ANNOTATION_TEAM_SLUG]);
};
const autoImportService = (entity) => {
  var _a, _b;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]) && Boolean((_b = entity.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]);
};
const autoImportFunctionality = (entity) => {
  var _a, _b;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT]) && Boolean((_b = entity.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT]);
};
const autoImportTeam = (entity) => {
  var _a, _b;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT]) && Boolean((_b = entity.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT]);
};

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class IncidentWrapper {
  constructor(incident, included) {
    __publicField(this, "incident");
    __publicField(this, "included");
    __publicField(this, "environments", () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.environments) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.environments) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type === "environments" && ids.includes(i.id);
        });
      }
      return [];
    });
    __publicField(this, "services", () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.services) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.services) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type === "services" && ids.includes(i.id);
        });
      }
      return [];
    });
    __publicField(this, "functionalities", () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.functionalities) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.functionalities) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type === "functionalities" && ids.includes(i.id);
        });
      }
      return [];
    });
    __publicField(this, "groups", () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.groups) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.groups) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type === "groups" && ids.includes(i.id);
        });
      }
      return [];
    });
    __publicField(this, "types", () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.incident_types) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.incident_types) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type === "incident_types" && ids.includes(i.id);
        });
      }
      return [];
    });
    this.incident = incident;
    this.included = included;
  }
}

const ColoredChip = ({
  label,
  tooltip,
  color
}) => {
  if (label) {
    return /* @__PURE__ */ React.createElement(Tooltip, { title: tooltip || label }, /* @__PURE__ */ React.createElement(
      Chip,
      {
        label,
        style: { backgroundColor: color || "#FFF" },
        size: "small"
      }
    ));
  }
  return /* @__PURE__ */ React.createElement(Chip, { label: "N/A", size: "small" });
};

const ColoredChips = ({
  objects
}) => {
  if ((objects == null ? void 0 : objects.length) > 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, objects.map((r) => {
      return /* @__PURE__ */ React.createElement(
        ColoredChip,
        {
          key: Math.random().toString(36),
          label: r.attributes.name,
          tooltip: r.attributes.description,
          color: r.attributes.color
        }
      );
    }));
  }
  return /* @__PURE__ */ React.createElement(Chip, { label: "N/A", size: "small" });
};

const ResolvedChip = withStyles({
  root: {
    backgroundColor: "#C5F0C0",
    color: "black"
  }
})(Chip);
const MitigatedChip = withStyles({
  root: {
    backgroundColor: "#FBE4A0",
    color: "black"
  }
})(Chip);
const StartedChip = withStyles({
  root: {
    backgroundColor: "#047BF8",
    color: "white"
  }
})(Chip);
const StatusChip = ({ status }) => {
  let chip = /* @__PURE__ */ React.createElement(React.Fragment, null);
  switch (status) {
    case "resolved":
    case "completed":
      chip = /* @__PURE__ */ React.createElement(ResolvedChip, { label: status, size: "small" });
      break;
    case "mitigated":
    case "in_progress":
    case "verifying":
    case "scheduled":
    case "cancelled":
      chip = /* @__PURE__ */ React.createElement(MitigatedChip, { label: status, size: "small" });
      break;
    case "started":
      chip = /* @__PURE__ */ React.createElement(StartedChip, { label: status, size: "small" });
      break;
    default:
      chip = /* @__PURE__ */ React.createElement(Chip, { label: status, size: "small" });
  }
  return /* @__PURE__ */ React.createElement(Tooltip, { title: status }, /* @__PURE__ */ React.createElement("span", null, chip));
};

const useStyles$3 = makeStyles((theme) => ({
  container: {
    width: 850
  },
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const DEFAULT_PAGE_NUMBER$3 = 1;
const DEFAULT_PAGE_SIZE$3 = 10;
const IncidentsTable = ({ params }) => {
  const classes = useStyles$3();
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const mediumColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER$3,
    size: DEFAULT_PAGE_SIZE$3
  });
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getIncidents({ ...params, page }),
    [page]
  );
  const columns = [
    {
      title: "Started At",
      field: "incident.attributes.started_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Title",
      field: "title",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        var _a;
        return /* @__PURE__ */ React.createElement(
          Tooltip,
          {
            title: ((_a = rowData.incident.attributes.summary) == null ? void 0 : _a.substring(0, 255)) || rowData.incident.attributes.title
          },
          /* @__PURE__ */ React.createElement(
            Link,
            {
              target: "blank",
              href: rowData.incident.attributes.url
            },
            rowData.incident.attributes.title
          )
        );
      }
    },
    {
      title: "Started By",
      field: "user.full_name",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        var _a;
        return /* @__PURE__ */ React.createElement(
          Chip,
          {
            label: (_a = rowData.incident.attributes.user) == null ? void 0 : _a.data.attributes.full_name,
            size: "small"
          }
        );
      }
    },
    {
      title: "Status",
      field: "status",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(StatusChip, { status: rowData.incident.attributes.status })
    },
    {
      title: "Severity",
      field: "severity",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        var _a, _b, _c;
        return /* @__PURE__ */ React.createElement(
          ColoredChip,
          {
            label: (_a = rowData.incident.attributes.severity) == null ? void 0 : _a.data.attributes.name,
            tooltip: (_b = rowData.incident.attributes.severity) == null ? void 0 : _b.data.attributes.description,
            color: (_c = rowData.incident.attributes.severity) == null ? void 0 : _c.data.attributes.color
          }
        );
      }
    },
    {
      title: "Environments",
      field: "environments",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, { objects: rowData.environments() })
    },
    {
      title: "Services",
      field: "services",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, { objects: rowData.services() })
    },
    {
      title: "Functionalities",
      field: "functionalities",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, { objects: rowData.functionalities() })
    },
    {
      title: "Teams",
      field: "teams",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, { objects: rowData.groups() })
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = response ? response.data.map((i) => {
    return new IncidentWrapper(i, response.included);
  }) : [];
  return /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: false,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: DEFAULT_PAGE_SIZE$3,
        padding: "dense"
      },
      localization: { header: { actions: void 0 } },
      columns,
      data,
      page: page.number - 1,
      totalCount: response == null ? void 0 : response.meta.total_count,
      emptyContent: /* @__PURE__ */ React.createElement("div", { className: classes.empty }, "No incidents"),
      onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
      onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
    }
  );
};

const useStyles$2 = makeStyles((theme) => ({
  container: {
    width: 850
  },
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const DEFAULT_PAGE_NUMBER$2 = 1;
const DEFAULT_PAGE_SIZE$2 = 10;
const ServicesTable = ({ params }) => {
  const classes = useStyles$2();
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const mediumColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER$2,
    size: DEFAULT_PAGE_SIZE$2
  });
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getServices({ ...params, page }),
    [page]
  );
  const nameColumn = useCallback((rowData) => {
    var _a;
    return /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: ((_a = rowData.attributes.description) == null ? void 0 : _a.substring(0, 255)) || rowData.attributes.name
      },
      /* @__PURE__ */ React.createElement(Link, { target: "blank", href: RootlyApi.getServiceDetailsURL(rowData) }, rowData.attributes.name)
    );
  }, []);
  const backstageColumn = useCallback((rowData) => {
    if (rowData.attributes.backstage_id) {
      return /* @__PURE__ */ React.createElement(
        EntityRefLink,
        {
          entityRef: parseEntityRef(rowData.attributes.backstage_id)
        }
      );
    }
    return /* @__PURE__ */ React.createElement("div", null, "N/A");
  }, []);
  const columns = [
    {
      title: "Name",
      field: "name",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: nameColumn
    },
    {
      title: "Backstage",
      field: "backstage",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: backstageColumn
    },
    {
      title: "Incidents",
      field: "attributes.incidents_count",
      type: "numeric",
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Updated At",
      field: "attributes.updated_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Created At",
      field: "attributes.created_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = response ? response.data : [];
  return /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: false,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: DEFAULT_PAGE_SIZE$2,
        padding: "dense"
      },
      localization: { header: { actions: void 0 } },
      columns,
      data,
      page: page.number - 1,
      totalCount: response == null ? void 0 : response.meta.total_count,
      emptyContent: /* @__PURE__ */ React.createElement("div", { className: classes.empty }, "No services"),
      onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
      onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
    }
  );
};

const useStyles$1 = makeStyles((theme) => ({
  container: {
    width: 850
  },
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const DEFAULT_PAGE_NUMBER$1 = 1;
const DEFAULT_PAGE_SIZE$1 = 10;
const FunctionalitiesTable = ({ params }) => {
  const classes = useStyles$1();
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const mediumColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER$1,
    size: DEFAULT_PAGE_SIZE$1
  });
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getFunctionalities({ ...params, page }),
    [page]
  );
  const nameColumn = useCallback((rowData) => {
    var _a;
    return /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: ((_a = rowData.attributes.description) == null ? void 0 : _a.substring(0, 255)) || rowData.attributes.name
      },
      /* @__PURE__ */ React.createElement(Link, { target: "blank", href: RootlyApi.getFunctionalityDetailsURL(rowData) }, rowData.attributes.name)
    );
  }, []);
  const backstageColumn = useCallback((rowData) => {
    if (rowData.attributes.backstage_id) {
      return /* @__PURE__ */ React.createElement(
        EntityRefLink,
        {
          entityRef: parseEntityRef(rowData.attributes.backstage_id)
        }
      );
    }
    return /* @__PURE__ */ React.createElement("div", null, "N/A");
  }, []);
  const columns = [
    {
      title: "Name",
      field: "name",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: nameColumn
    },
    {
      title: "Backstage",
      field: "backstage",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: backstageColumn
    },
    {
      title: "Incidents",
      field: "attributes.incidents_count",
      type: "numeric",
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Updated At",
      field: "attributes.updated_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Created At",
      field: "attributes.created_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = response ? response.data : [];
  return /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: false,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: DEFAULT_PAGE_SIZE$1,
        padding: "dense"
      },
      localization: { header: { actions: void 0 } },
      columns,
      data,
      page: page.number - 1,
      totalCount: response == null ? void 0 : response.meta.total_count,
      emptyContent: /* @__PURE__ */ React.createElement("div", { className: classes.empty }, "No functionalities"),
      onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
      onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
    }
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: 850
  },
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const TeamsTable = ({ params }) => {
  const classes = useStyles();
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const mediumColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER,
    size: DEFAULT_PAGE_SIZE
  });
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getTeams({ ...params, page }),
    [page]
  );
  const nameColumn = useCallback((rowData) => {
    var _a;
    return /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: ((_a = rowData.attributes.description) == null ? void 0 : _a.substring(0, 255)) || rowData.attributes.name
      },
      /* @__PURE__ */ React.createElement(Link, { target: "blank", href: RootlyApi.getTeamDetailsURL(rowData) }, rowData.attributes.name)
    );
  }, []);
  const backstageColumn = useCallback((rowData) => {
    if (rowData.attributes.backstage_id) {
      return /* @__PURE__ */ React.createElement(
        EntityRefLink,
        {
          entityRef: parseEntityRef(rowData.attributes.backstage_id)
        }
      );
    }
    return /* @__PURE__ */ React.createElement("div", null, "N/A");
  }, []);
  const columns = [
    {
      title: "Name",
      field: "name",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: nameColumn
    },
    {
      title: "Backstage",
      field: "backstage",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: backstageColumn
    },
    {
      title: "Incidents",
      field: "attributes.incidents_count",
      type: "numeric",
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Updated At",
      field: "attributes.updated_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Created At",
      field: "attributes.created_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = response ? response.data : [];
  return /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: false,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: DEFAULT_PAGE_SIZE,
        padding: "dense"
      },
      localization: { header: { actions: void 0 } },
      columns,
      data,
      page: page.number - 1,
      totalCount: response == null ? void 0 : response.meta.total_count,
      emptyContent: /* @__PURE__ */ React.createElement("div", { className: classes.empty }, "No teams"),
      onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
      onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
    }
  );
};

export { ColoredChip as C, FunctionalitiesTable as F, IncidentsTable as I, RootlyApiRef as R, ServicesTable as S, TeamsTable as T, ROOTLY_ANNOTATION_SERVICE_ID as a, ROOTLY_ANNOTATION_SERVICE_SLUG as b, autoImportService as c, ROOTLY_ANNOTATION_FUNCTIONALITY_ID as d, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG as e, ROOTLY_ANNOTATION_TEAM_ID as f, ROOTLY_ANNOTATION_TEAM_SLUG as g, StatusChip as h, autoImportFunctionality as i, autoImportTeam as j, RootlyPage as k, RootlyOverviewCard as l, RootlyIncidentsPage as m, RootlyPlugin as n, RootlyApi as o, isRootlyAvailable as p };
//# sourceMappingURL=index-BWCj2b_g.esm.js.map
