import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  Page,
  Progress
} from '@backstage/core-components';
import { attachComponentData } from '@backstage/core-plugin-api';
import { Box, Grid, TabProps } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { default as React } from 'react';
import { useAsync } from 'react-use';
import { IncidentsTable } from '../IncidentsTable';
import { useRootlyClient } from '../../api';

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const Route: (props: SubRoute) => null = () => null;

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

export const RootlyFunctionalityIncidentsPageLayout = ({ entity, organizationId }: { entity: Entity, organizationId?: string }) => {
  const rootlyClient = useRootlyClient({organizationId: organizationId});

  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name,
  });

  const {
    value: response,
    loading,
    error,
  } = useAsync(
    async () =>
      await rootlyClient.getFunctionalities({
        filter: {
          backstage_id: entityTriplet,
        },
      }),
    [],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const functionality =
    response && response.data && response.data.length > 0
      ? response.data[0]
      : null;

  if (!functionality) {
    return (
      <Page themeId="tool">
        <Content>
          <ContentHeader title={entity.metadata.name} />
          <Grid container spacing={3} direction="column">
            <Box sx={{ mx: 'auto' }} mt={2}>
              <Alert severity="error">
                Looks like this component is not linked to any functionalitys in
                Rootly
              </Alert>
            </Box>
          </Grid>
        </Content>
      </Page>
    );
  } 
    return (
      <Page themeId="tool">
        <Content>
        <ContentHeader title="Ongoing incidents" />
          <Grid container spacing={3} direction="column">
            <Grid item>
              <IncidentsTable
                organizationId={organizationId}
                params={{
                  filter: {
                    functionalitys: functionality.attributes.slug,
                    status: "started,mitigated"
                  },
                  include:
                    'environments,services,functionalities,groups,incident_types',
                }}
              />
            </Grid>
          </Grid>
          <ContentHeader title="Past incidents" />
          <Grid container spacing={3} direction="column">
            <Grid item>
              <IncidentsTable
                organizationId={organizationId}
                params={{
                  filter: {
                    functionalitys: functionality.attributes.slug,
                  },
                  include:
                    'environments,services,functionalities,groups,incident_types',
                }}
              />
            </Grid>
          </Grid>
        </Content>
      </Page>
    );
  
};

RootlyFunctionalityIncidentsPageLayout.Route = Route;
