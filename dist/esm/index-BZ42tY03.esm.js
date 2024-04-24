import React, { useState, useEffect } from 'react';
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
import { useAsync } from 'react-use';
import { R as RootlyApiRef, a as ROOTLY_ANNOTATION_SERVICE_ID, b as ROOTLY_ANNOTATION_SERVICE_SLUG, c as autoImportService, C as ColoredChip, i as StatusChip, d as ROOTLY_ANNOTATION_FUNCTIONALITY_ID, e as ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, j as autoImportFunctionality, f as ROOTLY_ANNOTATION_TEAM_ID, g as ROOTLY_ANNOTATION_TEAM_SLUG, k as autoImportTeam } from './index-Dk5kgccq.esm.js';
import 'qs';
import '@material-ui/core/Divider';

var RootlyResourceType = /* @__PURE__ */ ((RootlyResourceType2) => {
  RootlyResourceType2["Service"] = "Service";
  RootlyResourceType2["Functionality"] = "Functionality";
  RootlyResourceType2["Team"] = "Team";
  return RootlyResourceType2;
})(RootlyResourceType || {});

const truncate$2 = (input, length) => input.length > length ? `${input.substring(0, length)}...` : input;
const IncidentListItem$2 = ({
  incident
}) => {
  var _a, _b, _c;
  return /* @__PURE__ */ React.createElement(ListItem, { dense: true, key: incident.id, style: { paddingLeft: 0 } }, /* @__PURE__ */ React.createElement(
    ListItemText,
    {
      primary: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        Link,
        {
          style: { marginRight: 8 },
          target: "blank",
          href: incident.attributes.url
        },
        truncate$2(incident.attributes.title, 100)
      ), /* @__PURE__ */ React.createElement(
        ColoredChip,
        {
          label: (_a = incident.attributes.severity) == null ? void 0 : _a.data.attributes.name,
          tooltip: (_b = incident.attributes.severity) == null ? void 0 : _b.data.attributes.description,
          color: (_c = incident.attributes.severity) == null ? void 0 : _c.data.attributes.color
        }
      )),
      primaryTypographyProps: {
        variant: "body1"
      },
      secondary: /* @__PURE__ */ React.createElement(Typography, { noWrap: true, variant: "body2", color: "textSecondary" }, "Created ", moment(incident.attributes.created_at).fromNow())
    }
  ), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(StatusChip, { status: incident.attributes.status })));
};
const getViewIncidentsForServiceLink = (service, rootlyApi) => {
  return {
    label: "View Incidents",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(FilterList, null),
    href: rootlyApi.getListIncidentsForServiceURL(service)
  };
};
const RootlyOverviewServiceCard = () => {
  var _a, _b;
  const { entity } = useEntity();
  const RootlyApi = useApi(RootlyApiRef);
  const service_id_annotation = ((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_SERVICE_ID]) || ((_b = entity.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_SERVICE_SLUG]);
  const [reload, setReload] = useState(false);
  const createIncidentLink = {
    label: "Create Incident",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi.getCreateIncidentURL()
  };
  const viewIncidentsLink = {
    label: "View All Incidents",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi.getListIncidents()
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  useEffect(() => {
    if (service_id_annotation) {
      RootlyApi.getService(service_id_annotation).then((annotationServiceResponse) => {
        const annotationService = annotationServiceResponse.data;
        if (annotationService.attributes.backstage_id && annotationService.attributes.backstage_id !== entityTriplet) {
          RootlyApi.getServices({
            filter: {
              backstage_id: entityTriplet
            }
          }).then((servicesResponse) => {
            const service2 = servicesResponse && servicesResponse.data && servicesResponse.data.length > 0 ? servicesResponse.data[0] : null;
            if (service2) {
              RootlyApi.updateServiceEntity(
                entity,
                annotationService,
                service2
              );
            }
          });
        } else {
          RootlyApi.updateServiceEntity(entity, annotationService);
        }
      }).catch(() => {
        if (autoImportService(entity)) {
          RootlyApi.importServiceEntity(entity);
        }
      });
    }
  }, []);
  const {
    value: serviceResponse,
    loading: serviceLoading,
    error: serviceError
  } = useAsync(
    async () => await RootlyApi.getServices({
      filter: {
        backstage_id: entityTriplet
      }
    }),
    [reload]
  );
  const service = serviceResponse && serviceResponse.data && serviceResponse.data.length > 0 ? serviceResponse.data[0] : null;
  const {
    value: incidentsResponse,
    loading: incidentsLoading,
    error: incidentsError
  } = useAsync(
    async () => service ? await RootlyApi.getIncidents({
      filter: {
        services: service.attributes.slug,
        status: "started,mitigated"
      }
    }) : { data: [] },
    [service]
  );
  const {
    value: chartResponse,
    loading: chartLoading,
    error: chartError
  } = useAsync(
    async () => service ? await RootlyApi.getServiceIncidentsChart(service, {
      period: "day"
    }) : { data: [] },
    [service]
  );
  const incidents = incidentsResponse && incidentsResponse.data && incidentsResponse.data.length > 0 ? incidentsResponse.data : null;
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(
    CardHeader,
    {
      title: "Rootly",
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, service && /* @__PURE__ */ React.createElement(
        IconButton,
        {
          component: Link,
          "aria-label": "Refresh",
          disabled: false,
          title: "Refresh",
          onClick: () => setReload(!reload)
        },
        /* @__PURE__ */ React.createElement(CachedIcon, null)
      )),
      subheader: /* @__PURE__ */ React.createElement(
        HeaderIconLinkRow,
        {
          links: !serviceLoading && service ? [
            createIncidentLink,
            getViewIncidentsForServiceLink(service, RootlyApi),
            viewIncidentsLink
          ] : [createIncidentLink, viewIncidentsLink]
        }
      )
    }
  ), service && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, null), !chartLoading && !chartError && chartResponse && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "Incidents over last 30 days"), /* @__PURE__ */ React.createElement(
    LineChart,
    {
      data: chartResponse.data,
      height: "150px",
      colors: [blue[300]]
    }
  )), /* @__PURE__ */ React.createElement(Divider, null))), /* @__PURE__ */ React.createElement(CardContent, null, (serviceLoading || incidentsLoading) && /* @__PURE__ */ React.createElement(Progress, null), serviceError && /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, serviceError.message), incidentsError && /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, incidentsError.message), !incidentsLoading && !incidentsError && !incidentsLoading && incidents && /* @__PURE__ */ React.createElement(React.Fragment, null, incidents && incidents.length >= 0 && /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "There is ", /* @__PURE__ */ React.createElement("strong", null, incidents.length), " ongoing incidents for this service"), incidents && incidents.length === 0 && /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "No ongoing incidents"), /* @__PURE__ */ React.createElement(List, { dense: true }, incidents && incidents.map((incident) => /* @__PURE__ */ React.createElement(
    IncidentListItem$2,
    {
      incident,
      rootlyApi: RootlyApi
    }
  ))))));
};

const truncate$1 = (input, length) => input.length > length ? `${input.substring(0, length)}...` : input;
const IncidentListItem$1 = ({
  incident
}) => {
  var _a, _b, _c;
  return /* @__PURE__ */ React.createElement(ListItem, { dense: true, key: incident.id, style: { paddingLeft: 0 } }, /* @__PURE__ */ React.createElement(
    ListItemText,
    {
      primary: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        Link,
        {
          style: { marginRight: 8 },
          target: "blank",
          href: incident.attributes.url
        },
        truncate$1(incident.attributes.title, 100)
      ), /* @__PURE__ */ React.createElement(
        ColoredChip,
        {
          label: (_a = incident.attributes.severity) == null ? void 0 : _a.data.attributes.name,
          tooltip: (_b = incident.attributes.severity) == null ? void 0 : _b.data.attributes.description,
          color: (_c = incident.attributes.severity) == null ? void 0 : _c.data.attributes.color
        }
      )),
      primaryTypographyProps: {
        variant: "body1"
      },
      secondary: /* @__PURE__ */ React.createElement(Typography, { noWrap: true, variant: "body2", color: "textSecondary" }, "Created ", moment(incident.attributes.created_at).fromNow())
    }
  ), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(StatusChip, { status: incident.attributes.status })));
};
const getViewIncidentsForFunctionalityLink = (functionality, rootlyApi) => {
  return {
    label: "View Incidents",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(FilterList, null),
    href: rootlyApi.getListIncidentsForFunctionalityURL(functionality)
  };
};
const RootlyOverviewFunctionalityCard = () => {
  var _a, _b;
  const { entity } = useEntity();
  const RootlyApi = useApi(RootlyApiRef);
  const functionality_id_annotation = ((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) || ((_b = entity.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]);
  const [reload, setReload] = useState(false);
  const createIncidentLink = {
    label: "Create Incident",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi.getCreateIncidentURL()
  };
  const viewIncidentsLink = {
    label: "View All Incidents",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi.getListIncidents()
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  useEffect(() => {
    if (functionality_id_annotation) {
      RootlyApi.getFunctionality(functionality_id_annotation).then((annotationFunctionalityResponse) => {
        const annotationFunctionality = annotationFunctionalityResponse.data;
        if (annotationFunctionality.attributes.backstage_id && annotationFunctionality.attributes.backstage_id !== entityTriplet) {
          RootlyApi.getFunctionalities({
            filter: {
              backstage_id: entityTriplet
            }
          }).then((functionalitiesResponse) => {
            const functionality2 = functionalitiesResponse && functionalitiesResponse.data && functionalitiesResponse.data.length > 0 ? functionalitiesResponse.data[0] : null;
            if (functionality2) {
              RootlyApi.updateFunctionalityEntity(
                entity,
                annotationFunctionality,
                functionality2
              );
            }
          });
        } else {
          RootlyApi.updateFunctionalityEntity(entity, annotationFunctionality);
        }
      }).catch(() => {
        if (autoImportFunctionality(entity)) {
          RootlyApi.importFunctionalityEntity(entity);
        }
      });
    }
  }, []);
  const {
    value: functionalityResponse,
    loading: functionalityLoading,
    error: functionalityError
  } = useAsync(
    async () => await RootlyApi.getFunctionalities({
      filter: {
        backstage_id: entityTriplet
      }
    }),
    [reload]
  );
  const functionality = functionalityResponse && functionalityResponse.data && functionalityResponse.data.length > 0 ? functionalityResponse.data[0] : null;
  const {
    value: incidentsResponse,
    loading: incidentsLoading,
    error: incidentsError
  } = useAsync(
    async () => functionality ? await RootlyApi.getIncidents({
      filter: {
        functionalities: functionality.attributes.slug,
        status: "started,mitigated"
      }
    }) : { data: [] },
    [functionality]
  );
  const {
    value: chartResponse,
    loading: chartLoading,
    error: chartError
  } = useAsync(
    async () => functionality ? await RootlyApi.getFunctionalityIncidentsChart(functionality, {
      period: "day"
    }) : { data: [] },
    [functionality]
  );
  const incidents = incidentsResponse && incidentsResponse.data && incidentsResponse.data.length > 0 ? incidentsResponse.data : null;
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(
    CardHeader,
    {
      title: "Rootly",
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, functionality && /* @__PURE__ */ React.createElement(
        IconButton,
        {
          component: Link,
          "aria-label": "Refresh",
          disabled: false,
          title: "Refresh",
          onClick: () => setReload(!reload)
        },
        /* @__PURE__ */ React.createElement(CachedIcon, null)
      )),
      subheader: /* @__PURE__ */ React.createElement(
        HeaderIconLinkRow,
        {
          links: !functionalityLoading && functionality ? [
            createIncidentLink,
            getViewIncidentsForFunctionalityLink(functionality, RootlyApi),
            viewIncidentsLink
          ] : [createIncidentLink, viewIncidentsLink]
        }
      )
    }
  ), functionality && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, null), !chartLoading && !chartError && chartResponse && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "Incidents over last 30 days"), /* @__PURE__ */ React.createElement(
    LineChart,
    {
      data: chartResponse.data,
      height: "150px",
      colors: [blue[300]]
    }
  )), /* @__PURE__ */ React.createElement(Divider, null))), /* @__PURE__ */ React.createElement(CardContent, null, (functionalityLoading || incidentsLoading) && /* @__PURE__ */ React.createElement(Progress, null), functionalityError && /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, functionalityError.message), incidentsError && /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, incidentsError.message), !incidentsLoading && !incidentsError && !incidentsLoading && incidents && /* @__PURE__ */ React.createElement(React.Fragment, null, incidents && incidents.length >= 0 && /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "There is ", /* @__PURE__ */ React.createElement("strong", null, incidents.length), " ongoing incidents for this functionality"), incidents && incidents.length === 0 && /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "No ongoing incidents"), /* @__PURE__ */ React.createElement(List, { dense: true }, incidents && incidents.map((incident) => /* @__PURE__ */ React.createElement(
    IncidentListItem$1,
    {
      incident,
      rootlyApi: RootlyApi
    }
  ))))));
};

const truncate = (input, length) => input.length > length ? `${input.substring(0, length)}...` : input;
const IncidentListItem = ({
  incident
}) => {
  var _a, _b, _c;
  return /* @__PURE__ */ React.createElement(ListItem, { dense: true, key: incident.id, style: { paddingLeft: 0 } }, /* @__PURE__ */ React.createElement(
    ListItemText,
    {
      primary: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        Link,
        {
          style: { marginRight: 8 },
          target: "blank",
          href: incident.attributes.url
        },
        truncate(incident.attributes.title, 100)
      ), /* @__PURE__ */ React.createElement(
        ColoredChip,
        {
          label: (_a = incident.attributes.severity) == null ? void 0 : _a.data.attributes.name,
          tooltip: (_b = incident.attributes.severity) == null ? void 0 : _b.data.attributes.description,
          color: (_c = incident.attributes.severity) == null ? void 0 : _c.data.attributes.color
        }
      )),
      primaryTypographyProps: {
        variant: "body1"
      },
      secondary: /* @__PURE__ */ React.createElement(Typography, { noWrap: true, variant: "body2", color: "textSecondary" }, "Created ", moment(incident.attributes.created_at).fromNow())
    }
  ), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(StatusChip, { status: incident.attributes.status })));
};
const getViewIncidentsForTeamLink = (team, rootlyApi) => {
  return {
    label: "View Incidents",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(FilterList, null),
    href: rootlyApi.getListIncidentsForTeamURL(team)
  };
};
const RootlyOverviewTeamCard = () => {
  var _a, _b;
  const { entity } = useEntity();
  const RootlyApi = useApi(RootlyApiRef);
  const team_id_annotation = ((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_TEAM_ID]) || ((_b = entity.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_TEAM_SLUG]);
  const [reload, setReload] = useState(false);
  const createIncidentLink = {
    label: "Create Incident",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi.getCreateIncidentURL()
  };
  const viewIncidentsLink = {
    label: "View All Incidents",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi.getListIncidents()
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  useEffect(() => {
    if (team_id_annotation) {
      RootlyApi.getTeam(team_id_annotation).then((annotationTeamResponse) => {
        const annotationTeam = annotationTeamResponse.data;
        if (annotationTeam.attributes.backstage_id && annotationTeam.attributes.backstage_id !== entityTriplet) {
          RootlyApi.getTeams({
            filter: {
              backstage_id: entityTriplet
            }
          }).then((teamsResponse) => {
            const team2 = teamsResponse && teamsResponse.data && teamsResponse.data.length > 0 ? teamsResponse.data[0] : null;
            if (team2) {
              RootlyApi.updateTeamEntity(
                entity,
                annotationTeam,
                team2
              );
            }
          });
        } else {
          RootlyApi.updateTeamEntity(entity, annotationTeam);
        }
      }).catch(() => {
        if (autoImportTeam(entity)) {
          RootlyApi.importTeamEntity(entity);
        }
      });
    }
  }, []);
  const {
    value: teamResponse,
    loading: teamLoading,
    error: teamError
  } = useAsync(
    async () => await RootlyApi.getTeams({
      filter: {
        backstage_id: entityTriplet
      }
    }),
    [reload]
  );
  const team = teamResponse && teamResponse.data && teamResponse.data.length > 0 ? teamResponse.data[0] : null;
  const {
    value: incidentsResponse,
    loading: incidentsLoading,
    error: incidentsError
  } = useAsync(
    async () => team ? await RootlyApi.getIncidents({
      filter: {
        teams: team.attributes.slug,
        status: "started,mitigated"
      }
    }) : { data: [] },
    [team]
  );
  const {
    value: chartResponse,
    loading: chartLoading,
    error: chartError
  } = useAsync(
    async () => team ? await RootlyApi.getTeamIncidentsChart(team, {
      period: "day"
    }) : { data: [] },
    [team]
  );
  const incidents = incidentsResponse && incidentsResponse.data && incidentsResponse.data.length > 0 ? incidentsResponse.data : null;
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(
    CardHeader,
    {
      title: "Rootly",
      action: /* @__PURE__ */ React.createElement(React.Fragment, null, team && /* @__PURE__ */ React.createElement(
        IconButton,
        {
          component: Link,
          "aria-label": "Refresh",
          disabled: false,
          title: "Refresh",
          onClick: () => setReload(!reload)
        },
        /* @__PURE__ */ React.createElement(CachedIcon, null)
      )),
      subheader: /* @__PURE__ */ React.createElement(
        HeaderIconLinkRow,
        {
          links: !teamLoading && team ? [
            createIncidentLink,
            getViewIncidentsForTeamLink(team, RootlyApi),
            viewIncidentsLink
          ] : [createIncidentLink, viewIncidentsLink]
        }
      )
    }
  ), team && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, null), !chartLoading && !chartError && chartResponse && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "Incidents over last 30 days"), /* @__PURE__ */ React.createElement(
    LineChart,
    {
      data: chartResponse.data,
      height: "150px",
      colors: [blue[300]]
    }
  )), /* @__PURE__ */ React.createElement(Divider, null))), /* @__PURE__ */ React.createElement(CardContent, null, (teamLoading || incidentsLoading) && /* @__PURE__ */ React.createElement(Progress, null), teamError && /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, teamError.message), incidentsError && /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, incidentsError.message), !incidentsLoading && !incidentsError && !incidentsLoading && incidents && /* @__PURE__ */ React.createElement(React.Fragment, null, incidents && incidents.length >= 0 && /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "There is ", /* @__PURE__ */ React.createElement("strong", null, incidents.length), " ongoing incidents for this team"), incidents && incidents.length === 0 && /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle1" }, "No ongoing incidents"), /* @__PURE__ */ React.createElement(List, { dense: true }, incidents && incidents.map((incident) => /* @__PURE__ */ React.createElement(
    IncidentListItem,
    {
      incident,
      rootlyApi: RootlyApi
    }
  ))))));
};

const RootlyOverviewCard = (resourceType) => {
  const resource = () => {
    switch (resourceType) {
      case RootlyResourceType.Service:
        return RootlyOverviewServiceCard();
      case RootlyResourceType.Functionality:
        return RootlyOverviewFunctionalityCard();
      case RootlyResourceType.Team:
        return RootlyOverviewTeamCard();
      default:
        return RootlyOverviewServiceCard();
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, resource());
};

export { RootlyOverviewCard };
//# sourceMappingURL=index-BZ42tY03.esm.js.map
