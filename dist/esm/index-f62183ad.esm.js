import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension, createComponentExtension, useApi, attachComponentData } from '@backstage/core-plugin-api';
import { stringifyEntityRef, parseEntityRef } from '@backstage/catalog-model';
import qs from 'qs';
import React, { useState, useEffect, useCallback, Children, isValidElement, Fragment } from 'react';
import 'react-router';
import { EntityRefLink, useEntity } from '@backstage/plugin-catalog-react';
import { Select, Table, Page, Header, RoutedTabs, Progress, Content, ContentHeader } from '@backstage/core-components';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import { useAsync } from 'react-use';
import { Dialog, DialogTitle, DialogContent, Box, Button, Typography, DialogActions, Tooltip, Chip, withStyles, makeStyles, IconButton, Menu, MenuItem, ListItemIcon, Grid } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import '@material-ui/icons/Sync';
import '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

const RootlyApiRef = createApiRef({
  id: "plugin.rootly.service"
});
const DEFAULT_PROXY_PATH = "/rootly/api";
class RootlyApi {
  constructor(opts) {
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
  async getServices(opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(`/v1/services?${params}`, init);
    return response;
  }
  async getIncidents(opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(`/v1/incidents?${params}`, init);
    return response;
  }
  async getServiceIncidentsChart(service, opts) {
    const init = { headers: { "Content-Type": "application/vnd.api+json" } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch(`/v1/services/${service.id}/incidents_chart?${params}`, init);
    return response;
  }
  async importEntity(entity) {
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
            backstage_id: entityTriplet
          }
        }
      })
    };
    await this.call(`/v1/services`, init);
  }
  async updateEntity(entity, old_service, service) {
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
            backstage_id: entityTriplet
          }
        }
      })
    };
    await this.call(`/v1/services/${service.id}`, init2);
  }
  async deleteEntity(service) {
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
  getCreateIncidentURL() {
    return `${this.domain}/account/incidents?auto-open=true`;
  }
  getListIncidents() {
    return `${this.domain}/account/incidents`;
  }
  getListIncidentsForServiceURL(service) {
    const params = qs.stringify({ services: [service.attributes.slug] }, { arrayFormat: "brackets" });
    return `${this.domain}/account/incidents?${params}`;
  }
  getServiceDetailsURL(service) {
    return `${this.domain}/account/services/${service.attributes.slug}`;
  }
  getIncidentDetailsURL(incident) {
    return `${this.domain}/account/incidents/${incident.attributes.slug}`;
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

const RootlyPage = RootlyPlugin.provide(createRoutableExtension({
  name: "RootlyPage",
  component: () => import('./index-341c6d00.esm.js').then((m) => m.RootlyPage),
  mountPoint: RootlyRouteRef
}));
const RootlyOverviewCard = RootlyPlugin.provide(createComponentExtension({
  name: "RootlyOverviewCard",
  component: {
    lazy: () => import('./index-156df37c.esm.js').then((m) => m.RootlyOverviewCard)
  }
}));
RootlyPlugin.provide(createComponentExtension({
  name: "RootlyIncidentsPage",
  component: {
    lazy: () => import('./index-1c6def65.esm.js').then((m) => m.RootlyIncidentsPage)
  }
}));

const ROOTLY_ANNOTATION = "rootly.com/component-selector";
const ROOTLY_TEAM_ANNOTATION = "rootly.com/team";
const isRootlyAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION]);
};

const ServicesDialog = ({
  open,
  entity,
  handleClose,
  handleImport,
  handleUpdate
}) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [selectedItem, setSelectedItem] = useState("");
  const {
    value: response,
    loading,
    error
  } = useAsync(async () => await RootlyApi.getServices({
    filter: {
      backstage_id: null
    },
    page: { size: 999 }
  }));
  const data = response ? response.data : [];
  useEffect(() => {
    var _a;
    if (entity && data) {
      const entityTriplet = stringifyEntityRef({
        namespace: entity.metadata.namespace,
        kind: entity.kind,
        name: entity.metadata.name
      });
      const selectedItem2 = (_a = data.find((s) => s.attributes.backstage_id == entityTriplet)) == null ? void 0 : _a.id;
      if (selectedItem2) {
        setSelectedItem(selectedItem2);
      }
    }
  }, [data]);
  const onSelectedServiceChanged = (newSelectedItem) => {
    setSelectedItem(newSelectedItem);
  };
  const onImportAsNewServiceButtonClicked = () => {
    handleImport(entity);
  };
  const onLinkToExistingServiceButtonClicked = () => {
    var _a;
    handleUpdate(entity, { id: (_a = entity.linkedService) == null ? void 0 : _a.id }, { id: selectedItem });
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  return /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose: handleClose,
    "aria-labelledby": "dialog-title",
    "aria-describedby": "dialog-description"
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    id: "dialog-title"
  }, "Services"), /* @__PURE__ */ React.createElement(DialogContent, null, entity && !entity.linkedService && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    sx: { mx: "auto" },
    mb: 2
  }, /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    variant: "contained",
    onClick: onImportAsNewServiceButtonClicked
  }, "Import as new service")), /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(Box, {
    sx: { mx: "auto" },
    mt: 2
  }, /* @__PURE__ */ React.createElement(Typography, null, "Select a Rootly service you want to map this component to:"), /* @__PURE__ */ React.createElement(Select, {
    onChange: onSelectedServiceChanged,
    selected: selectedItem,
    placeholder: "Select",
    label: "Services",
    items: (data || []).map((service) => {
      return {
        label: service.attributes.name,
        value: service.id
      };
    })
  }))), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    onClick: onLinkToExistingServiceButtonClicked
  }, "Link")));
};

class IncidentWrapper {
  constructor(incident, included) {
    this.environments = () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.environments) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.environments) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type == "environments" && ids.includes(i.id);
        });
      } else {
        return [];
      }
    };
    this.services = () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.services) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.services) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type == "services" && ids.includes(i.id);
        });
      } else {
        return [];
      }
    };
    this.functionalities = () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.functionalities) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.functionalities) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type == "functionalities" && ids.includes(i.id);
        });
      } else {
        return [];
      }
    };
    this.groups = () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.groups) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.groups) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type == "groups" && ids.includes(i.id);
        });
      } else {
        return [];
      }
    };
    this.types = () => {
      var _a, _b, _c, _d, _e;
      if ((_b = (_a = this.incident.relationships) == null ? void 0 : _a.incident_types) == null ? void 0 : _b.data) {
        const ids = (_d = (_c = this.incident.relationships) == null ? void 0 : _c.incident_types) == null ? void 0 : _d.data.map((r) => {
          return r.id;
        });
        return (_e = this.included) == null ? void 0 : _e.filter((i) => {
          return i.type == "incident_types" && ids.includes(i.id);
        });
      } else {
        return [];
      }
    };
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
    return /* @__PURE__ */ React.createElement(Tooltip, {
      title: tooltip || label
    }, /* @__PURE__ */ React.createElement(Chip, {
      label,
      style: { backgroundColor: color || "#FFF" },
      size: "small"
    }));
  } else {
    return /* @__PURE__ */ React.createElement(Chip, {
      label: "N/A",
      size: "small"
    });
  }
};

const ColoredChips = ({
  objects
}) => {
  if ((objects == null ? void 0 : objects.length) > 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, objects.map((r) => {
      return /* @__PURE__ */ React.createElement(ColoredChip, {
        key: Math.random().toString(36),
        label: r.attributes.name,
        tooltip: r.attributes.description,
        color: r.attributes.color
      });
    }));
  }
  return /* @__PURE__ */ React.createElement(Chip, {
    label: "N/A",
    size: "small"
  });
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
      chip = /* @__PURE__ */ React.createElement(ResolvedChip, {
        label: status,
        size: "small"
      });
      break;
    case "mitigated":
    case "in_progress":
    case "verifying":
    case "scheduled":
    case "cancelled":
      chip = /* @__PURE__ */ React.createElement(MitigatedChip, {
        label: status,
        size: "small"
      });
      break;
    case "started":
      chip = /* @__PURE__ */ React.createElement(StartedChip, {
        label: status,
        size: "small"
      });
      break;
    default:
      chip = /* @__PURE__ */ React.createElement(Chip, {
        label: status,
        size: "small"
      });
  }
  return /* @__PURE__ */ React.createElement(Tooltip, {
    title: status
  }, /* @__PURE__ */ React.createElement("span", null, chip));
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
const IncidentsTable = ({ params }) => {
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
  } = useAsync(async () => await RootlyApi.getIncidents({ ...params, page }), [page]);
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
        return /* @__PURE__ */ React.createElement(Tooltip, {
          title: ((_a = rowData.incident.attributes.summary) == null ? void 0 : _a.substring(0, 255)) || rowData.incident.attributes.title
        }, /* @__PURE__ */ React.createElement(Link, {
          target: "blank",
          href: RootlyApi.getIncidentDetailsURL(rowData.incident)
        }, rowData.incident.attributes.title));
      }
    },
    {
      title: "Started By",
      field: "user.full_name",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        var _a;
        return /* @__PURE__ */ React.createElement(Chip, {
          label: (_a = rowData.incident.attributes.user) == null ? void 0 : _a.data.attributes.full_name,
          size: "small"
        });
      }
    },
    {
      title: "Status",
      field: "status",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(StatusChip, {
        status: rowData.incident.attributes.status
      })
    },
    {
      title: "Severity",
      field: "severity",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        var _a, _b, _c;
        return /* @__PURE__ */ React.createElement(ColoredChip, {
          label: (_a = rowData.incident.attributes.severity) == null ? void 0 : _a.data.attributes.name,
          tooltip: (_b = rowData.incident.attributes.severity) == null ? void 0 : _b.data.attributes.description,
          color: (_c = rowData.incident.attributes.severity) == null ? void 0 : _c.data.attributes.color
        });
      }
    },
    {
      title: "Environments",
      field: "environments",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, {
        objects: rowData.environments()
      })
    },
    {
      title: "Services",
      field: "services",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, {
        objects: rowData.services()
      })
    },
    {
      title: "Functionalities",
      field: "functionalities",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, {
        objects: rowData.functionalities()
      })
    },
    {
      title: "Teams",
      field: "teams",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, {
        objects: rowData.groups()
      })
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  const data = response ? response.data.map((i) => {
    return new IncidentWrapper(i, response.included);
  }) : [];
  return /* @__PURE__ */ React.createElement(Table, {
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
    emptyContent: /* @__PURE__ */ React.createElement("div", {
      className: classes.empty
    }, "No incidents"),
    onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
    onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
  });
};

const ServiceActionsMenu = ({ service }) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "more",
    "aria-controls": "long-menu",
    "aria-haspopup": "true",
    onClick: handleClick
  }, /* @__PURE__ */ React.createElement(MoreVertIcon, null)), /* @__PURE__ */ React.createElement(Menu, {
    id: `actions-menu-${service.id}`,
    anchorEl,
    keepMounted: true,
    open: Boolean(anchorEl),
    onClose: handleCloseMenu,
    PaperProps: {
      style: { maxHeight: 48 * 4.5 }
    }
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    key: "details",
    onClick: handleCloseMenu
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(OpenInNewIcon, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(Typography, {
    variant: "inherit",
    noWrap: true
  }, /* @__PURE__ */ React.createElement(Link, {
    target: "blank",
    href: RootlyApi.getServiceDetailsURL(service)
  }, "View in Rootly")))));
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
const ServicesTable = ({ params }) => {
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
  } = useAsync(async () => await RootlyApi.getServices({ ...params, page }), [page]);
  const nameColumn = useCallback((rowData) => {
    var _a;
    return /* @__PURE__ */ React.createElement(Tooltip, {
      title: ((_a = rowData.attributes.description) == null ? void 0 : _a.substring(0, 255)) || rowData.attributes.name
    }, /* @__PURE__ */ React.createElement(Link, {
      target: "blank",
      href: RootlyApi.getServiceDetailsURL(rowData)
    }, rowData.attributes.name));
  }, []);
  const backstageColumn = useCallback((rowData) => {
    if (rowData.attributes.backstage_id) {
      return /* @__PURE__ */ React.createElement(EntityRefLink, {
        entityRef: parseEntityRef(rowData.attributes.backstage_id)
      });
    } else {
      return /* @__PURE__ */ React.createElement("div", null, "N/A");
    }
  }, []);
  useCallback((rowData) => {
    return /* @__PURE__ */ React.createElement(ServiceActionsMenu, {
      service: rowData
    });
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
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  const data = response ? response.data : [];
  return /* @__PURE__ */ React.createElement(Table, {
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
    emptyContent: /* @__PURE__ */ React.createElement("div", {
      className: classes.empty
    }, "No services"),
    onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
    onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
  });
};

const Route$1 = () => null;
attachComponentData(Route$1, "core.gatherMountPoints", true);
function createSubRoutesFromChildren(childrenProps) {
  const routeType = (/* @__PURE__ */ React.createElement(Route$1, {
    path: "",
    title: ""
  }, /* @__PURE__ */ React.createElement("div", null))).type;
  return Children.toArray(childrenProps).flatMap((child) => {
    if (!isValidElement(child)) {
      return [];
    }
    if (child.type === Fragment) {
      return createSubRoutesFromChildren(child.props.children);
    }
    if (child.type !== routeType) {
      throw new Error("Child of ExploreLayout must be an ExploreLayout.Route");
    }
    const { path, title, children, tabProps } = child.props;
    return [{ path, title, children, tabProps }];
  });
}
const DefaultRootlyPageLayout = ({ children }) => {
  const routes = createSubRoutesFromChildren(children);
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Rootly"
  }), /* @__PURE__ */ React.createElement(RoutedTabs, {
    routes
  }));
};
DefaultRootlyPageLayout.Route = Route$1;

const Route = () => null;
attachComponentData(Route, "core.gatherMountPoints", true);
const RootlyIncidentsPageLayout = () => {
  const { entity } = useEntity();
  const RootlyApi = useApi(RootlyApiRef);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleCloseImport = async (entity2) => {
    await RootlyApi.importEntity(entity2);
    setReload(!reload);
  };
  const handleCloseUpdate = async (entity2, old_service, service2) => {
    await RootlyApi.updateEntity(entity2, old_service, service2);
    setReload(!reload);
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  const {
    value: response,
    loading,
    error
  } = useAsync(async () => await RootlyApi.getServices({
    filter: {
      backstage_id: entityTriplet
    }
  }), [reload]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  const service = response && response.data && response.data.length > 0 ? response.data[0] : null;
  if (!service) {
    return /* @__PURE__ */ React.createElement(Page, {
      themeId: "tool"
    }, /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
      title: entity.metadata.name
    }), /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      spacing: 3,
      direction: "column"
    }, /* @__PURE__ */ React.createElement(Box, {
      sx: { mx: "auto" },
      mt: 2
    }, /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Looks like this component is not linked to any services in Rootly")), /* @__PURE__ */ React.createElement(Box, {
      sx: { mx: "auto" },
      mt: 2
    }, /* @__PURE__ */ React.createElement(Button, {
      color: "primary",
      variant: "contained",
      onClick: handleOpenDialog
    }, "Import or link to an existing Rootly service")), /* @__PURE__ */ React.createElement(ServicesDialog, {
      open,
      entity,
      handleClose: handleCloseDialog,
      handleImport: handleCloseImport,
      handleUpdate: handleCloseUpdate
    }))));
  } else {
    return /* @__PURE__ */ React.createElement(Page, {
      themeId: "tool"
    }, /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
      title: "Ongoing incidents"
    }), /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      spacing: 3,
      direction: "column"
    }, /* @__PURE__ */ React.createElement(Grid, {
      item: true
    }, /* @__PURE__ */ React.createElement(IncidentsTable, {
      params: {
        filter: {
          services: service.attributes.slug,
          status: "started,mitigated"
        },
        include: "environments,services,functionalities,groups,incident_types"
      }
    }))), /* @__PURE__ */ React.createElement(ContentHeader, {
      title: "Past incidents"
    }), /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      spacing: 3,
      direction: "column"
    }, /* @__PURE__ */ React.createElement(Grid, {
      item: true
    }, /* @__PURE__ */ React.createElement(IncidentsTable, {
      params: {
        filter: {
          services: service.attributes.slug
        },
        include: "environments,services,functionalities,groups,incident_types"
      }
    })))));
  }
};
RootlyIncidentsPageLayout.Route = Route;

export { ColoredChip as C, DefaultRootlyPageLayout as D, IncidentsTable as I, RootlyApiRef as R, ServicesDialog as S, ServicesTable as a, StatusChip as b, RootlyIncidentsPageLayout as c, RootlyPlugin as d, RootlyPage as e, RootlyOverviewCard as f, RootlyApi as g, ROOTLY_ANNOTATION as h, ROOTLY_TEAM_ANNOTATION as i, isRootlyAvailable as j };
//# sourceMappingURL=index-f62183ad.esm.js.map
