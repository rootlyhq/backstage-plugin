import { Grid, TabProps } from '@material-ui/core';
import {
  default as React,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Content,
  ContentHeader,
  Page,
  Progress,
} from '@backstage/core-components';
import { Alert } from '@material-ui/lab';
import { IncidentsTable } from '../IncidentsTable';
import { useRootlyClient } from '../../api';
import {
  RootlyEntity,
  RootlyService,
  RootlyFunctionality,
  RootlyTeam,
} from '@rootly/backstage-plugin-common';
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
    .reduce(
      (acc, entity) => {
        const orgId =
          entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID] || 'unknown';
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
      },
      {} as Record<string, string[]>,
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
  include: 'environments,teams,services,functionalities,groups,incident_types',
});

export const RootlySystemIncidentsPageLayout = ({
  entities,
}: {
  entities: RootlyEntity[];
}) => {
  const serviceEntitiesTriplets = useMemo(
    () => extractEntities(entities, 'Service'),
    [entities],
  );
  const functionalityEntitiesTriplets = useMemo(
    () => extractEntities(entities, 'Functionality'),
    [entities],
  );
  const teamEntitiesTriplets = useMemo(
    () => extractEntities(entities, 'Team'),
    [entities],
  );

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async (
    entitiesTriplets: Record<string, string[]>,
    type: string,
  ): Promise<RootlyResourceAsyncStateType> => {
    const res = new Map<string, AsyncState<any>>();
    const fetchPromises = Object.entries(entitiesTriplets).map(
      async ([orgId, ids]) => {
        try {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const rootlyClient = useRootlyClient({organizationId: orgId});
          switch (type) {
            case 'Services': {
              const results = await rootlyClient.getServices({
                filter: { backstage_id: ids.join(',') },
              });
              res.set(orgId, {
                value: results,
                loading: false,
                error: undefined,
              });
              break;
            }
            case 'Functionalities': {
              const results = await rootlyClient.getFunctionalities({
                filter: { backstage_id: ids.join(',') },
              });
              res.set(orgId, {
                value: results,
                loading: false,
                error: undefined,
              });
              break;
            }
            case 'Teams': {
              const results = await rootlyClient.getTeams({
                filter: { backstage_id: ids.join(',') },
              });
              res.set(orgId, {
                value: results,
                loading: false,
                error: undefined,
              });
              break;
            }
            default: {
              throw new Error('Invalid entity type');
            }
          }
        } catch (e) {
          res.set(orgId, {
            value: undefined,
            loading: false,
            error: e as Error,
          });
        }
        return res;
      },
    );
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
        fetchData(serviceEntitiesTriplets, 'Services'),
        fetchData(functionalityEntitiesTriplets, 'Functionalities'),
        fetchData(teamEntitiesTriplets, 'Teams'),
      ]);
      setResponses({ services, functionalities, teams });
    } catch (e) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, [
    fetchData,
    serviceEntitiesTriplets,
    functionalityEntitiesTriplets,
    teamEntitiesTriplets,
  ]);

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

  const orgKeys: string[] = [
    ...new Set([
      ...responses.services.keys(),
      ...responses.functionalities.keys(),
      ...responses.teams.keys(),
    ]),
  ].sort();

  return (
    <Page themeId="tool">
      <Content>
        {orgKeys.map(orgId => (
          <React.Fragment key={orgId}>
            <ContentHeader title={orgId} />
            <ContentHeader title="Ongoing incidents" />
            <Grid container spacing={3} direction="column">
              <Grid item>
                <IncidentsTable
                  organizationId={orgId}
                  params={getTableParams(
                    services[orgId] || [],
                    functionalities[orgId] || [],
                    teams[orgId] || [],
                    'started,mitigated',
                  )}
                />
              </Grid>
            </Grid>
            <ContentHeader title="Past incidents" />
            <Grid container spacing={3} direction="column">
              <Grid item>
                <IncidentsTable
                  organizationId={orgId}
                  params={getTableParams(
                    services[orgId] || [],
                    functionalities[orgId] || [],
                    teams[orgId] || [],
                  )}
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
