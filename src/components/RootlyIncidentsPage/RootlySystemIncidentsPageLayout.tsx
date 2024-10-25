import { Grid, TabProps } from '@material-ui/core';
import { default as React, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Content, ContentHeader, Page, Progress } from '@backstage/core-components';
import { Alert } from '@material-ui/lab';
import { configApiRef, discoveryApiRef, identityApiRef, useApi } from '@backstage/core-plugin-api';
import { IncidentsTable } from '../IncidentsTable';
import { useRootlyClient } from '../../api';
import { RootlyEntity, RootlyService, RootlyFunctionality, RootlyTeam } from '@rootly/backstage-plugin-common';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { ROOTLY_ANNOTATION_ORG_ID } from '@rootly/backstage-plugin-common';
import { AsyncState } from 'react-use/lib/useAsync';

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

type RootlyResourceAsyncStateType = Map<string, AsyncState<any>>;

const Route: (props: SubRoute) => null = () => null;

const extractEntities = (entities: RootlyEntity[], kind: string) =>
  entities
    .filter(entity => entity.rootlyKind === kind)
    .reduce((acc, entity) => {
      const orgId = entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID] || 'unknown';
      const entityRef = stringifyEntityRef({
        namespace: entity.metadata.namespace,
        kind: entity.kind,
        name: entity.metadata.name,
      });
      if (!acc[orgId]) {
        acc[orgId] = [];
      }
      acc[orgId].push(entityRef);
      return acc;
    }, {} as Record<string, string[]>);

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
  include: 'environments,teams,services,functionalities,groups,incident_types',
});

export const RootlySystemIncidentsPageLayout = ({ entities }: { entities: RootlyEntity[] }) => {
  const configApi = useApi(configApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const identityApi = useApi(identityApiRef);
  const rootlyClient = useRootlyClient({
    discovery: discoveryApi,
    identify: identityApi,
    config: configApi,
  });

  const serviceEntitiesTriplets = useMemo(() => extractEntities(entities, 'Service'), [entities]);
  const functionalityEntitiesTriplets = useMemo(() => extractEntities(entities, 'Functionality'), [entities]);
  const teamEntitiesTriplets = useMemo(() => extractEntities(entities, 'Team'), [entities]);

  const [responses, setResponses] = useState<{
    services: RootlyResourceAsyncStateType;
    functionalities: RootlyResourceAsyncStateType;
    teams: RootlyResourceAsyncStateType;
  }>({
    services: new Map(),
    functionalities: new Map(),
    teams: new Map(),
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false); // To prevent multiple fetch attempts

  const fetchData = async (
    entitiesTriplets: Record<string, string[]>,
    fetchFunction: (ids: string) => Promise<any>,
  ): Promise<RootlyResourceAsyncStateType> => {
    const res = new Map<string, AsyncState<any>>();
    const fetchPromises = Object.entries(entitiesTriplets).map(async ([orgId, ids]) => {
      try {
        const result = await fetchFunction(ids.join(','));
        res.set(orgId, { value: result, loading: false, error: undefined });
      } catch (e) {
        res.set(orgId, { value: undefined, loading: false, error: e as Error });
      }
    });
    await Promise.all(fetchPromises);
    return res;
  };

  const fetchAllData = useCallback(async () => {
    if (hasFetched.current) return; // Prevent multiple fetch attempts
    hasFetched.current = true;
    setLoading(true);
    setError(null);
    try {
      const [services, functionalities, teams] = await Promise.all([
        fetchData(serviceEntitiesTriplets, ids => rootlyClient.getServices({ filter: { backstage_id: ids } })),
        fetchData(functionalityEntitiesTriplets, ids => rootlyClient.getFunctionalities({ filter: { backstage_id: ids } })),
        fetchData(teamEntitiesTriplets, ids => rootlyClient.getTeams({ filter: { backstage_id: ids } })),
      ]);
      setResponses({ services, functionalities, teams });
    } catch (e) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, [serviceEntitiesTriplets, functionalityEntitiesTriplets, teamEntitiesTriplets, rootlyClient]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) return <Progress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const services: Record<string, RootlyService[]> = {};
  const functionalities: Record<string, RootlyFunctionality[]> = {};
  const teams: Record<string, RootlyTeam[]> = {};

  responses.services.forEach((response, orgId) => {
    services[orgId] = response.value?.data || [];
  });

  responses.functionalities.forEach((response, orgId) => {
    functionalities[orgId] = response.value?.data || [];
  });

  responses.teams.forEach((response, orgId) => {
    teams[orgId] = response.value?.data || [];
  });

  const orgKeys = [...new Set([...responses.services.keys(), ...responses.functionalities.keys(), ...responses.teams.keys()])];

  return (
    <Page themeId="tool">
      <Content>
        {orgKeys.map(key => (
          <React.Fragment key={key}>
            <ContentHeader title={key} />
            <ContentHeader title="Ongoing incidents" />
            <Grid container spacing={3} direction="column">
              <Grid item>
                <IncidentsTable
                  organizationId={key}
                  params={getTableParams(services[key] || [], functionalities[key] || [], teams[key] || [], 'started,mitigated')}
                />
              </Grid>
            </Grid>
            <ContentHeader title="Past incidents" />
            <Grid container spacing={3} direction="column">
              <Grid item>
                <IncidentsTable
                  organizationId={key}
                  params={getTableParams(services[key] || [], functionalities[key] || [], teams[key] || [])}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        ))}
      </Content>
    </Page>
  );
};

RootlySystemIncidentsPageLayout.Route = Route;
