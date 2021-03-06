import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  Progress,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
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
import { Rootly, RootlyApiRef } from '../../api';
import { Incident, Service } from '../../types';
import { ColoredChip } from '../UI/ColoredChip';
import { StatusChip } from '../UI/StatusChip';

const truncate = (input: string, length: number) =>
  input.length > length ? `${input.substring(0, length)}...` : input;

const IncidentListItem = ({
  incident,
  rootlyApi,
}: {
  incident: Incident;
  rootlyApi: Rootly;
}) => {
  return (
    <ListItem dense key={incident.id} style={{ paddingLeft: 0 }}>
      <ListItemText
        primary={
          <>
            <Link
              style={{ marginRight: 8 }}
              target="blank"
              href={rootlyApi.getIncidentDetailsURL(incident)}
            >
              {truncate(incident.attributes.title, 100)}
            </Link>
            <ColoredChip
              label={incident.attributes.severity?.data.attributes.name}
              tooltip={
                incident.attributes.severity?.data.attributes.description
              }
              color={incident.attributes.severity?.data.attributes.color}
            />
          </>
        }
        primaryTypographyProps={{
          variant: 'body1',
        }}
        secondary={
          <Typography noWrap variant="body2" color="textSecondary">
            Created {moment(incident.attributes.created_at).fromNow()}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <StatusChip status={incident.attributes.status} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const getViewIncidentsForServiceLink = (
  service: Service,
  rootlyApi: Rootly,
) => {
  return {
    label: 'View Incidents',
    disabled: false,
    icon: <FilterList />,
    href: rootlyApi.getListIncidentsForServiceURL(service),
  };
};

export const RootlyOverviewCard = () => {
  const { entity } = useEntity();
  const RootlyApi = useApi(RootlyApiRef);

  const [reload, setReload] = useState(false);

  const createIncidentLink: IconLinkVerticalProps = {
    label: 'Create Incident',
    disabled: false,
    icon: <WhatshotIcon />,
    href: RootlyApi.getCreateIncidentURL(),
  };

  const viewIncidentsLink: IconLinkVerticalProps = {
    label: 'View All Incident',
    disabled: false,
    icon: <WhatshotIcon />,
    href: RootlyApi.getListIncidents(),
  };

  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name,
  });

  const {
    value: serviceResponse,
    loading: serviceLoading,
    error: serviceError,
  } = useAsync(
    async () =>
      await RootlyApi.getServices({
        filter: {
          backstage_id: entityTriplet,
        },
      }),
    [reload],
  );

  const service =
    serviceResponse && serviceResponse.data && serviceResponse.data.length > 0
      ? serviceResponse.data[0]
      : null;

  const {
    value: incidentsResponse,
    loading: incidentsLoading,
    error: incidentsError,
  } = useAsync(
    async () =>
      service
        ? await RootlyApi.getIncidents({
            filter: {
              services: service.attributes.slug,
              status: 'started,mitigated',
            },
          })
        : { data: [] },
    [service],
  );

  const {
    value: chartResponse,
    loading: chartLoading,
    error: chartError,
  } = useAsync(
    async () =>
      service
        ? await RootlyApi.getServiceIncidentsChart(service, {
            period: 'week',
          })
        : { data: [] },
    [service],
  );

  const incidents =
    incidentsResponse &&
    incidentsResponse.data &&
    incidentsResponse.data.length > 0
      ? incidentsResponse.data
      : null;

  return (
    <Card>
      <CardHeader
        title="Rootly"
        action={
          <>
            {service && (
              <IconButton
                component={Link}
                aria-label="Refresh"
                disabled={false}
                title="Refresh"
                onClick={() => setReload(!reload)}
              >
                <CachedIcon />
              </IconButton>
            )}
          </>
        }
        subheader={
          <HeaderIconLinkRow
            links={
              !serviceLoading && service
                ? [
                    createIncidentLink,
                    getViewIncidentsForServiceLink(service, RootlyApi),
                    viewIncidentsLink,
                  ]
                : [createIncidentLink, viewIncidentsLink]
            }
          />
        }
      />
      {service && (
        <>
          <Divider />
          {!chartLoading && !chartError && chartResponse && (
            <>
              <CardContent>
                <Typography variant="subtitle1">
                  Incidents over last 30 days
                </Typography>
                <LineChart
                  data={chartResponse.data}
                  height="150px"
                  colors={[blue[300]]}
                />
              </CardContent>
              <Divider />
            </>
          )}
        </>
      )}
      <CardContent>
        {(serviceLoading || incidentsLoading) && <Progress />}
        {serviceError && <Alert severity="error">{serviceError.message}</Alert>}
        {incidentsError && (
          <Alert severity="error">{incidentsError.message}</Alert>
        )}
        {!incidentsLoading &&
          !incidentsError &&
          !incidentsLoading &&
          incidents && (
            <>
              {incidents && incidents.length >= 0 && (
                <Typography variant="subtitle1">
                  There is <strong>{incidents.length}</strong> ongoing incidents
                  for this service
                </Typography>
              )}
              {incidents && incidents.length === 0 && (
                <Typography variant="subtitle1">
                  No ongoing incidents
                </Typography>
              )}
              <List dense>
                {incidents &&
                  incidents.map((incident: Incident) => (
                    <IncidentListItem
                      incident={incident}
                      rootlyApi={RootlyApi}
                    />
                  ))}
              </List>
            </>
          )}
      </CardContent>
    </Card>
  );
};
