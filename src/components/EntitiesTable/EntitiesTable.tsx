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
  ROOTLY_ANNOTATION_ORG_ID,
  RootlyApi,
} from '@rootly/backstage-plugin-common';
import { useRootlyClient } from '../../api';

export const EntitiesTable = () => {
  const catalogApi = useApi(catalogApiRef);

  const smallColumnStyle = {
    width: '5%',
    maxWidth: '5%',
  };

  const { value, loading, error } = useAsync(
    async () => await catalogApi.getEntities(),
  );

  const fetchService = (entity: RootlyEntity) => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rootlyClient = useRootlyClient({organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]});

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
        await rootlyClient.getServices({
          filter: {
            backstage_id: entityTriplet,
          },
        }),
      [],
    );
    if (loading) {
      return <Progress />;
    } else if (error) {
      return <div>Error</div>;
    }
    if (response && response.data.length > 0) {
      entity.linkedService = response.data[0] as RootlyService;
      return (
        <Link
          target="blank"
          href={RootlyApi.getServiceDetailsURL(entity.linkedService)}
        >
          {entity.linkedService.attributes.name}
        </Link>
      );
    } 
      entity.linkedService = undefined;
      return <div>Not Linked</div>;
  };

  const fetchFunctionality = (entity: RootlyEntity) => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rootlyClient = useRootlyClient({organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]});

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
      return <div>Error</div>;
    }
    if (response && response.data.length > 0) {
      entity.linkedFunctionality = response.data[0] as RootlyFunctionality;
      return (
        <Link
          target="blank"
          href={RootlyApi.getFunctionalityDetailsURL(entity.linkedFunctionality)}
        >
          {entity.linkedFunctionality.attributes.name}
        </Link>
      );
    } 
      entity.linkedFunctionality = undefined;
      return <div>Not Linked</div>;
  };

  const fetchTeam = (entity: RootlyEntity) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rootlyClient = useRootlyClient({ organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]});

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
        await rootlyClient.getTeams({
          filter: {
            backstage_id: entityTriplet,
          },
        }),
      [],
    );
    if (loading) {
      return <Progress />;
    } else if (error) {
      return <div>Error</div>;
    }
    if (response && response.data.length > 0) {
      entity.linkedTeam = response.data[0] as RootlyTeam;
      return (
        <Link
          target="blank"
          href={RootlyApi.getTeamDetailsURL(entity.linkedTeam)}
        >
          {entity.linkedTeam.attributes.name}
        </Link>
      );
    } 
      entity.linkedTeam = undefined;
      return <div>Not Linked</div>;
  };

  const columns: TableColumn<RootlyEntity>[] = [
    {
      title: 'Kind',
      field: 'kind',
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
    },
    {
      title: 'Name',
      field: 'metadata.name',
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => {
        return <EntityRefLink entityRef={rowData} />;
      },
    },
    {
      title: 'Description',
      field: 'metadata.description',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
    },
    {
      title: 'Rootly Service',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => {
        return fetchService(rowData);
      },
    },
    {
      title: 'Rootly Functionality',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => {
        return fetchFunctionality(rowData);
      },
    },
    {
      title: 'Rootly Team',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => {
        return fetchTeam(rowData);
      },
    },
  ];

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const data = value
    ? value.items.map(entity => {
        const entityTriplet = stringifyEntityRef({
          namespace: entity.metadata.namespace,
          kind: entity.kind,
          name: entity.metadata.name,
        });
        return { ...entity, id: entityTriplet, rootlyKind: undefined, linkedService: undefined, linkedFunctionality: undefined, linkedTeam: undefined};
      })
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
        padding: 'dense',
      }}
      localization={{ header: { actions: undefined } }}
      columns={columns}
      data={data}
    />
  );
};
