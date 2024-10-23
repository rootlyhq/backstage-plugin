import { Grid, TabProps } from '@material-ui/core';
import { default as React } from 'react';
import { Content, ContentHeader, Page, Progress } from '@backstage/core-components';
import { Alert } from '@material-ui/lab';
import { configApiRef, discoveryApiRef, identityApiRef, useApi } from '@backstage/core-plugin-api';
import { IncidentsTable } from '../IncidentsTable';
import { useRootlyClient } from '../../api';
import { RootlyEntity, RootlyService, RootlyFunctionality, RootlyTeam } from '@rootly/backstage-plugin-common/src/types';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { useAsync } from 'react-use';
import { RootlyFunctionalitiesResponse, RootlyServicesResponse, RootlyTeamsResponse } from '@rootly/backstage-plugin-common';

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const Route: (props: SubRoute) => null = () => null;

const useFetchData = (
  triplets: string[],
  fetchFunction: (ids: string) => Promise<any>,
) => {
  const fetchKey = triplets.join(','); // Use a string representation as the dependency
  return useAsync(async () => {
    if (triplets.length === 0) {
      return { value: { data: [] }, loading: false, error: null };
    }
    return await fetchFunction(fetchKey);
  }, [fetchKey]);
};

const extractEntities = (
  entities: RootlyEntity[],
  kind: string,
) =>
  entities
    .filter(entity => entity.rootlyKind === kind)
    .map(entity =>
      stringifyEntityRef({
        namespace: entity.metadata.namespace,
        kind: entity.kind,
        name: entity.metadata.name,
      }),
    );

const getTableParams = (
  services: RootlyService[],
  functionalities: RootlyFunctionality[],
  teams: RootlyTeam[],
  status?: string,
) => ({
  filter: {
    status,
    services: services.map(o => o.attributes.slug).join(','),
    functionalities: functionalities.map(o => o.attributes.slug).join(','),
    groups: teams.map(o => o.attributes.slug).join(','),
  },
  include:
    'environments,teams,services,functionalities,groups,incident_types',
});

export const RootlySystemIncidentsPageLayout = ({
  entities,
  organizationId,
}: {
  entities: RootlyEntity[];
  organizationId?: string;
}) => {
  const configApi = useApi(configApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const identityApi = useApi(identityApiRef);
  const rootlyClient = useRootlyClient({
    discovery: discoveryApi,
    identify: identityApi,
    config: configApi,
    organizationId,
  });

  const serviceEntitiesTriplets = React.useMemo(
    () => extractEntities(entities, 'Service'),
    [entities],
  );
  const functionalityEntitiesTriplets = React.useMemo(
    () => extractEntities(entities, 'Functionality'),
    [entities],
  );
  const teamEntitiesTriplets = React.useMemo(
    () => extractEntities(entities, 'Team'),
    [entities],
  );

  const serviceResponse = useFetchData(serviceEntitiesTriplets, ids =>
    rootlyClient.getServices({ filter: { backstage_id: ids } }),
  );

  const functionalityResponse = useFetchData(
    functionalityEntitiesTriplets,
    ids => rootlyClient.getFunctionalities({ filter: { backstage_id: ids } }),
  );

  const teamResponse = useFetchData(teamEntitiesTriplets, ids =>
    rootlyClient.getTeams({ filter: { backstage_id: ids } }),
  );

  const isLoading =
    serviceResponse.loading ||
    functionalityResponse.loading ||
    teamResponse.loading;

  const isSuccess =
    !isLoading &&
    !serviceResponse.error &&
    !functionalityResponse.error &&
    !teamResponse.error;

  if (isLoading) return <Progress />;
  if (!isSuccess)
    return (
      <Alert severity="error">
        {serviceResponse.error?.message ||
          functionalityResponse.error?.message ||
          teamResponse.error?.message ||
          'An error occurred while fetching data.'}
      </Alert>
    );

  const services = (serviceResponse.value as RootlyServicesResponse).data || [];
  const functionalities = (functionalityResponse.value as RootlyFunctionalitiesResponse).data || [];
  const teams = (teamResponse.value as RootlyTeamsResponse).data || [];

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Ongoing incidents" />
        <Grid container spacing={3} direction="column">
          <Grid item>
            <IncidentsTable
              organizationId={organizationId}
              params={getTableParams(services, functionalities, teams, 'started,mitigated')}
            />
          </Grid>
        </Grid>
        <ContentHeader title="Past incidents" />
        <Grid container spacing={3} direction="column">
          <Grid item>
            <IncidentsTable
              organizationId={organizationId}
              params={getTableParams(services, functionalities, teams)}
            />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

RootlySystemIncidentsPageLayout.Route = Route;
