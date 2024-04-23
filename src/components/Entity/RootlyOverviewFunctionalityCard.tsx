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
import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { Rootly, RootlyApiRef } from '../../api';
import { Entity, Incident, Functionality } from '../../types';
import { ColoredChip } from '../UI/ColoredChip';
import { StatusChip } from '../UI/StatusChip';
import {
  autoImportFunctionality,
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
} from '../../integration';

const truncate = (input: string, length: number) =>
  input.length > length ? `${input.substring(0, length)}...` : input;

const IncidentListItem = ({
  incident,
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
              href={incident.attributes.url}
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

const getViewIncidentsForFunctionalityLink = (
  functionality: Functionality,
  rootlyApi: Rootly,
) => {
  return {
    label: 'View Incidents',
    disabled: false,
    icon: <FilterList />,
    href: rootlyApi.getListIncidentsForFunctionalityURL(functionality),
  };
};

export const RootlyOverviewFunctionalityCard = () => {
  const { entity } = useEntity();
  const RootlyApi = useApi(RootlyApiRef);

  const functionality_id_annotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];

  const [reload, setReload] = useState(false);

  const createIncidentLink: IconLinkVerticalProps = {
    label: 'Create Incident',
    disabled: false,
    icon: <WhatshotIcon />,
    href: RootlyApi.getCreateIncidentURL(),
  };

  const viewIncidentsLink: IconLinkVerticalProps = {
    label: 'View All Incidents',
    disabled: false,
    icon: <WhatshotIcon />,
    href: RootlyApi.getListIncidents(),
  };

  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name,
  });

  useEffect(() => {
    if (functionality_id_annotation) {
      RootlyApi.getFunctionality(functionality_id_annotation)
        .then(annotationFunctionalityResponse => {
          const annotationFunctionality = annotationFunctionalityResponse.data;
          if (
            annotationFunctionality.attributes.backstage_id &&
            annotationFunctionality.attributes.backstage_id !== entityTriplet
          ) {
            RootlyApi.getFunctionalities({
              filter: {
                backstage_id: entityTriplet,
              },
            }).then(functionalitiesResponse => {
              const functionality =
                functionalitiesResponse &&
                functionalitiesResponse.data &&
                functionalitiesResponse.data.length > 0
                  ? functionalitiesResponse.data[0]
                  : null;
              if (functionality) {
                RootlyApi.updateFunctionalityEntity(
                  entity as Entity,
                  annotationFunctionality,
                  functionality,
                );
              }
            });
          } else {
            RootlyApi.updateFunctionalityEntity(entity as Entity, annotationFunctionality);
          }
        })
        .catch(() => {
          if (autoImportFunctionality(entity)) {
            RootlyApi.importFunctionalityEntity(entity as Entity);
          }
        });
    }
  }, []);

  const {
    value: functionalityResponse,
    loading: functionalityLoading,
    error: functionalityError,
  } = useAsync(
    async () =>
      await RootlyApi.getFunctionalities({
        filter: {
          backstage_id: entityTriplet,
        },
      }),
    [reload],
  );

  const functionality =
    functionalityResponse && functionalityResponse.data && functionalityResponse.data.length > 0
      ? functionalityResponse.data[0]
      : null;

  const {
    value: incidentsResponse,
    loading: incidentsLoading,
    error: incidentsError,
  } = useAsync(
    async () =>
      functionality
        ? await RootlyApi.getIncidents({
            filter: {
              functionalities: functionality.attributes.slug,
              status: 'started,mitigated',
            },
          })
        : { data: [] },
    [functionality],
  );

  const {
    value: chartResponse,
    loading: chartLoading,
    error: chartError,
  } = useAsync(
    async () =>
      functionality
        ? await RootlyApi.getFunctionalityIncidentsChart(functionality, {
            period: 'day',
          })
        : { data: [] },
    [functionality],
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
            {functionality && (
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
              !functionalityLoading && functionality
                ? [
                    createIncidentLink,
                    getViewIncidentsForFunctionalityLink(functionality, RootlyApi),
                    viewIncidentsLink,
                  ]
                : [createIncidentLink, viewIncidentsLink]
            }
          />
        }
      />
      {functionality && (
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
        {(functionalityLoading || incidentsLoading) && <Progress />}
        {functionalityError && <Alert severity="error">{functionalityError.message}</Alert>}
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
                  for this functionality
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
