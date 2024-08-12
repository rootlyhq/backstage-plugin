import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  Page,
  Progress
} from '@backstage/core-components';
import { attachComponentData, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Box, Button, Grid, TabProps } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { default as React, useState } from 'react';
import { useAsync } from 'react-use';
import { IncidentsTable } from '../IncidentsTable';
import { ServicesDialog } from '../ServicesDialog';

import {
  RootlyApiRef,
  RootlyEntity,
  RootlyService,
} from '@rootly/backstage-plugin-common';

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const Route: (props: SubRoute) => null = () => null;

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

export const RootlyIncidentsPageLayout = () => {
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

  const handleCloseImport = async (entity: RootlyEntity) => {
    await RootlyApi.importServiceEntity(entity);
    setReload(!reload);
  };

  const handleCloseUpdate = async (
    entity: RootlyEntity,
    service: RootlyService,
    old_service?: RootlyService,
  ) => {
    await RootlyApi.updateServiceEntity(entity, service, old_service);
    setReload(!reload);
  };

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
      await RootlyApi.getServices({
        filter: {
          backstage_id: entityTriplet,
        },
      }),
    [reload],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const service =
    response && response.data && response.data.length > 0
      ? response.data[0]
      : null;

  if (!service) {
    return (
      <Page themeId="tool">
        <Content>
          <ContentHeader title={entity.metadata.name} />
          <Grid container spacing={3} direction="column">
            <Box sx={{ mx: 'auto' }} mt={2}>
              <Alert severity="error">
                Looks like this component is not linked to any services in
                Rootly
              </Alert>
            </Box>
            <Box sx={{ mx: 'auto' }} mt={2}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleOpenDialog}
              >
                Import or link to an existing Rootly service
              </Button>
            </Box>
            <ServicesDialog
              open={open}
              entity={entity as RootlyEntity}
              handleClose={handleCloseDialog}
              handleImport={handleCloseImport}
              handleUpdate={handleCloseUpdate}
            />
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
                params={{
                  filter: {
                    services: service.attributes.slug,
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
                params={{
                  filter: {
                    services: service.attributes.slug,
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

RootlyIncidentsPageLayout.Route = Route;
