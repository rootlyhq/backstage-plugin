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
import React, { useState, useEffect } from 'react';
import { useAsync } from 'react-use';
import { ColoredChip } from '../UI/ColoredChip.esm.js';
import { StatusChip } from '../UI/StatusChip.esm.js';
import { autoImportTeam } from '../../integration.esm.js';
import { RootlyApiRef, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG } from '@rootly/backstage-plugin-common';

const truncate = (input, length) => input.length > length ? `${input.substring(0, length)}...` : input;
const IncidentListItem = ({
  incident
}) => {
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
          label: incident.attributes.severity?.data.attributes.name,
          tooltip: incident.attributes.severity?.data.attributes.description,
          color: incident.attributes.severity?.data.attributes.color
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
  const { entity } = useEntity();
  const RootlyApi2 = useApi(RootlyApiRef);
  const team_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];
  const [reload, setReload] = useState(false);
  const createIncidentLink = {
    label: "Create Incident",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi2.getCreateIncidentURL()
  };
  const viewIncidentsLink = {
    label: "View All Incidents",
    disabled: false,
    icon: /* @__PURE__ */ React.createElement(WhatshotIcon, null),
    href: RootlyApi2.getListIncidents()
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  useEffect(() => {
    if (team_id_annotation) {
      RootlyApi2.getTeam(team_id_annotation).then((annotationTeamResponse) => {
        const annotationTeam = annotationTeamResponse.data;
        if (annotationTeam.attributes.backstage_id && annotationTeam.attributes.backstage_id !== entityTriplet) {
          RootlyApi2.getTeams({
            filter: {
              backstage_id: entityTriplet
            }
          }).then((teamsResponse) => {
            const team2 = teamsResponse && teamsResponse.data && teamsResponse.data.length > 0 ? teamsResponse.data[0] : null;
            if (team2) {
              RootlyApi2.updateTeamEntity(
                entity,
                annotationTeam,
                team2
              );
            }
          });
        } else {
          RootlyApi2.updateTeamEntity(entity, annotationTeam);
        }
      }).catch(() => {
        if (autoImportTeam(entity)) {
          RootlyApi2.importTeamEntity(entity);
        }
      });
    }
  }, []);
  const {
    value: teamResponse,
    loading: teamLoading,
    error: teamError
  } = useAsync(
    async () => await RootlyApi2.getTeams({
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
    async () => team ? await RootlyApi2.getIncidents({
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
    async () => team ? await RootlyApi2.getTeamIncidentsChart(team, {
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
            getViewIncidentsForTeamLink(team, RootlyApi2),
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
      rootlyApi: RootlyApi2
    }
  ))))));
};

export { RootlyOverviewTeamCard };
//# sourceMappingURL=RootlyOverviewTeamCard.esm.js.map
