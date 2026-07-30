import { stringifyEntityRef } from '@backstage/catalog-model';
import { Progress, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useAsync } from 'react-use';

import {
  RootlyEntity,
  RootlyService,
  RootlyFunctionality,
  RootlyTeam,
  RootlyCatalogEntity,
  ROOTLY_ANNOTATION_ORG_ID,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_ID,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG
} from '@rootly/backstage-plugin-common';
import { useRootlyClient } from '../../api';

type RootlyEntityCellProps = {
  entity: RootlyEntity;
};

const getEntityTriplet = (entity: Pick<RootlyEntity, 'metadata' | 'kind'>) =>
  stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });

const ServiceLinkCell = ({ entity }: RootlyEntityCellProps) => {
  const rootlyClient = useRootlyClient({
    organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
  });
  const entityTriplet = getEntityTriplet(entity);
  const {
    value: response,
    loading,
    error
  } = useAsync(() => rootlyClient.getServices({ filter: { backstage_id: entityTriplet } }), [entityTriplet, rootlyClient]);

  if (loading) return <Progress />;
  if (error) return <div>Error</div>;

  const service = response?.data[0] as RootlyService | undefined;
  return service ? (
    <Link target="blank" href={rootlyClient.getServiceDetailsURL(service)}>
      {service.attributes.name}
    </Link>
  ) : (
    <div>Not Linked</div>
  );
};

const FunctionalityLinkCell = ({ entity }: RootlyEntityCellProps) => {
  const rootlyClient = useRootlyClient({
    organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
  });
  const entityTriplet = getEntityTriplet(entity);
  const {
    value: response,
    loading,
    error
  } = useAsync(
    () =>
      rootlyClient.getFunctionalities({
        filter: { backstage_id: entityTriplet }
      }),
    [entityTriplet, rootlyClient]
  );

  if (loading) return <Progress />;
  if (error) return <div>Error</div>;

  const functionality = response?.data[0] as RootlyFunctionality | undefined;
  return functionality ? (
    <Link target="blank" href={rootlyClient.getFunctionalityDetailsURL(functionality)}>
      {functionality.attributes.name}
    </Link>
  ) : (
    <div>Not Linked</div>
  );
};

const TeamLinkCell = ({ entity }: RootlyEntityCellProps) => {
  const rootlyClient = useRootlyClient({
    organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
  });
  const entityTriplet = getEntityTriplet(entity);
  const {
    value: response,
    loading,
    error
  } = useAsync(() => rootlyClient.getTeams({ filter: { backstage_id: entityTriplet } }), [entityTriplet, rootlyClient]);

  if (loading) return <Progress />;
  if (error) return <div>Error</div>;

  const team = response?.data[0] as RootlyTeam | undefined;
  return team ? (
    <Link target="blank" href={rootlyClient.getTeamDetailsURL(team)}>
      {team.attributes.name}
    </Link>
  ) : (
    <div>Not Linked</div>
  );
};

const CatalogEntityLinkCell = ({ entity }: RootlyEntityCellProps) => {
  const rootlyClient = useRootlyClient({
    organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
  });
  const catalogEntityAnnotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_CATALOG_ENTITY_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG];
  const {
    value: response,
    loading,
    error
  } = useAsync(
    () =>
      catalogEntityAnnotation
        ? rootlyClient.getCatalogEntity(catalogEntityAnnotation, {
            include: 'catalog'
          })
        : Promise.resolve(undefined),
    [catalogEntityAnnotation, rootlyClient]
  );

  if (!catalogEntityAnnotation) return <div>-</div>;
  if (loading) return <Progress />;
  if (error) return <div>Error</div>;

  const catalogEntity = response?.data as RootlyCatalogEntity | undefined;
  const catalogSlug = response?.included?.find((included: any) => included.type === 'catalogs')?.attributes?.slug;

  return catalogEntity ? (
    <Link target="blank" href={rootlyClient.getCatalogEntityDetailsURL(catalogEntity, catalogSlug)}>
      {catalogEntity.attributes.name}
    </Link>
  ) : (
    <div>Not Linked</div>
  );
};
export const EntitiesTable = () => {
  const catalogApi = useApi(catalogApiRef);
  const smallColumnStyle = {
    width: '5%',
    maxWidth: '5%'
  };
  const { value, loading, error } = useAsync(() => catalogApi.getEntities(), [catalogApi]);

  const columns: TableColumn<RootlyEntity>[] = [
    {
      title: 'Kind',
      field: 'kind',
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle
    },
    {
      title: 'Name',
      field: 'metadata.name',
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <EntityRefLink entityRef={rowData} />
    },
    {
      title: 'Description',
      field: 'metadata.description',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle
    },
    {
      title: 'Rootly Service',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <ServiceLinkCell entity={rowData} />
    },
    {
      title: 'Rootly Functionality',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <FunctionalityLinkCell entity={rowData} />
    },
    {
      title: 'Rootly Team',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <TeamLinkCell entity={rowData} />
    },
    {
      title: 'Rootly Catalog Entity',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <CatalogEntityLinkCell entity={rowData} />
    }
  ];

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const data = value
    ? value.items.map(entity => ({
        ...entity,
        id: getEntityTriplet(entity),
        rootlyKind: undefined,
        linkedService: undefined,
        linkedFunctionality: undefined,
        linkedTeam: undefined,
        linkedCatalogEntity: undefined
      }))
    : [];

  return (
    <Table
      isLoading={loading}
      options={{
        sorting: true,
        search: true,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: 25,
        pageSizeOptions: [25, 50, 100, 150, 200],
        padding: 'dense'
      }}
      localization={{ header: { actions: undefined } }}
      columns={columns}
      data={data}
    />
  );
};
