import { stringifyEntityRef } from '@backstage/catalog-model';
import { HeaderIconLinkRow, Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Card, CardHeader, IconButton, Divider, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { FilterList } from '@material-ui/icons';
import CachedIcon from '@material-ui/icons/Cached';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import { Alert } from '@material-ui/lab';
import { LineChart } from 'react-chartkick';
import { blue } from '@material-ui/core/colors';
import 'chartkick/chart.js';
import moment from 'moment';
import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { R as RootlyApiRef, C as ColoredChip, b as StatusChip } from './index-8222806b.esm.js';
import 'qs';
import '@material-ui/core/Divider';

const truncate = (input, length) => input.length > length ? `${input.substring(0, length)}...` : input;
const IncidentListItem = ({
  incident,
  rootlyApi
}) => {
  var _a, _b, _c;
  return /* @__PURE__ */ React.createElement(ListItem, {
    dense: true,
    key: incident.id,
    style: { paddingLeft: 0 }
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Link, {
      style: { marginRight: 8 },
      target: "blank",
      href: rootlyApi.getIncidentDetailsURL(incident)
    }, truncate(incident.attributes.title, 100)), /* @__PURE__ */ React.createElement(ColoredChip, {
      label: (_a = incident.attributes.severity) == null ? void 0 : _a.data.attributes.name,
      tooltip: (_b = incident.attributes.severity) == null ? void 0 : _b.data.attributes.description,
      color: (_c = incident.attributes.severity) == null ? void 0 : _c.data.attributes.color
    })),
    primaryTypographyProps: {
      variant: "body1"
    },
    secondary: /* @__PURE__ */ React.createElement(Typography, {
      noWrap: true,
      variant: "body2",
      color: "textSecondary"
    }, "Created ", moment(incident.attributes.created_at).fromNow())
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(StatusChip, {
    status: incident.attributes.status
  })));
};
const getViewIncidentsForServiceLink = (service, rootlyApi) => {
  return {
    label: "View Incidents",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(FilterList, null),
    href: rootlyApi.getListIncidentsForServiceURL(service)
  };
};
const RootlyOverviewCard = () => {
  const { entity } = useEntity();
  const RootlyApi = useApi(RootlyApiRef);
  const [reload, setReload] = useState(false);
  const createIncidentLink = {
    label: "Create Incident",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi.getCreateIncidentURL()
  };
  const viewIncidentsLink = {
    label: "View All Incident",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi.getListIncidents()
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  const {
    value: serviceResponse,
    loading: serviceLoading,
    error: serviceError
  } = useAsync(async () => await RootlyApi.getServices({
    filter: {
      backstage_id: entityTriplet
    }
  }), [reload]);
  const service = serviceResponse && serviceResponse.data && serviceResponse.data.length > 0 ? serviceResponse.data[0] : null;
  const {
    value: incidentsResponse,
    loading: incidentsLoading,
    error: incidentsError
  } = useAsync(async () => service ? await RootlyApi.getIncidents({
    filter: {
      services: service.attributes.slug,
      status: "started,mitigated"
    }
  }) : { data: [] }, [service]);
  const {
    value: chartResponse,
    loading: chartLoading,
    error: chartError
  } = useAsync(async () => service ? await RootlyApi.getServiceIncidentsChart(service, {
    period: "week"
  }) : { data: [] }, [service]);
  const incidents = incidentsResponse && incidentsResponse.data && incidentsResponse.data.length > 0 ? incidentsResponse.data : null;
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, {
    title: "Rootly",
    action: /* @__PURE__ */ React.createElement(React.Fragment, null, service && /* @__PURE__ */ React.createElement(IconButton, {
      component: Link,
      "aria-label": "Refresh",
      disabled: false,
      title: "Refresh",
      onClick: () => setReload(!reload)
    }, /* @__PURE__ */ React.createElement(CachedIcon, null))),
    subheader: /* @__PURE__ */ React.createElement(HeaderIconLinkRow, {
      links: !serviceLoading && service ? [
        createIncidentLink,
        getViewIncidentsForServiceLink(service, RootlyApi),
        viewIncidentsLink
      ] : [createIncidentLink, viewIncidentsLink]
    })
  }), service && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, null), !chartLoading && !chartError && chartResponse && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle1"
  }, "Incidents over last 30 days"), /* @__PURE__ */ React.createElement(LineChart, {
    data: chartResponse.data,
    height: "150px",
    colors: [blue[300]]
  })), /* @__PURE__ */ React.createElement(Divider, null))), /* @__PURE__ */ React.createElement(CardContent, null, (serviceLoading || incidentsLoading) && /* @__PURE__ */ React.createElement(Progress, null), serviceError && /* @__PURE__ */ React.createElement(Alert, {
    severity: "error"
  }, serviceError.message), incidentsError && /* @__PURE__ */ React.createElement(Alert, {
    severity: "error"
  }, incidentsError.message), !incidentsLoading && !incidentsError && !incidentsLoading && incidents && /* @__PURE__ */ React.createElement(React.Fragment, null, incidents && incidents.length >= 0 && /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle1"
  }, "There is ", /* @__PURE__ */ React.createElement("strong", null, incidents.length), " ongoing incidents for this service"), incidents && incidents.length === 0 && /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle1"
  }, "No ongoing incidents"), /* @__PURE__ */ React.createElement(List, {
    dense: true
  }, incidents && incidents.map((incident) => /* @__PURE__ */ React.createElement(IncidentListItem, {
    incident,
    rootlyApi: RootlyApi
  }))))));
};

export { RootlyOverviewCard };
//# sourceMappingURL=index-c8bb48c9.esm.js.map
