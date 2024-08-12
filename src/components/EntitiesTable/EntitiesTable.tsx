import { stringifyEntityRef } from '@backstage/catalog-model';
import { Progress, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { useAsync } from 'react-use';

import {
  autoImportService,
} from '../../integration';

import {
  RootlyApiRef,
  RootlyEntity,
  RootlyService,
  RootlyFunctionality,
  RootlyTeam,
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
} from '@rootly/backstage-plugin-common';

export const EntitiesTable = () => {
  const catalogApi = useApi(catalogApiRef);
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: '5%',
    maxWidth: '5%',
  };

  const { value, loading, error } = useAsync(
    async () => await catalogApi.getEntities(),
  );

  // const handleServiceUpdate = async (
  //   entity: RootlyEntity,
  //   service: RootlyService,
  //   old_service?: RootlyService,
  // ) => {
  //   await RootlyApi.updateServiceEntity(entity, service, old_service);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  // const handleServiceImport = async (entity: RootlyEntity) => {
  //   await RootlyApi.importServiceEntity(entity);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  // const handleServiceDelete = async (service: RootlyService) => {
  //   await RootlyApi.deleteServiceEntity(service);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  // const handleFunctionalityUpdate = async (
  //   entity: RootlyEntity,
  //   service: RootlyFunctionality,
  //   old_service?: RootlyFunctionality,
  // ) => {
  //   await RootlyApi.updateFunctionalityEntity(entity, service, old_service);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  // const handleFunctionalityImport = async (entity: RootlyEntity) => {
  //   await RootlyApi.importFunctionalityEntity(entity);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  // const handleFunctionalityDelete = async (service: RootlyFunctionality) => {
  //   await RootlyApi.deleteFunctionalityEntity(service);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  // const handleTeamUpdate = async (
  //   entity: RootlyEntity,
  //   team: RootlyTeam,
  //   old_team?: RootlyTeam,
  // ) => {
  //   await RootlyApi.updateTeamEntity(entity, team, old_team);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  // const handleTeamImport = async (entity: RootlyEntity) => {
  //   await RootlyApi.importTeamEntity(entity);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  // const handleTeamDelete = async (team: RootlyTeam) => {
  //   await RootlyApi.deleteTeamEntity(team);
  //   setTimeout(() => setReload(!reload), 500);
  // };

  useEffect(() => {
    catalogApi.getEntities().then(entities => {
      entities.items.forEach(entity => {
        const entityTriplet = stringifyEntityRef({
          namespace: entity.metadata.namespace,
          kind: entity.kind,
          name: entity.metadata.name,
        });

        const service_id_annotation =
          entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] ||
          entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];

        if (service_id_annotation) {
          RootlyApi.getService(service_id_annotation)
            .then(annotationServiceResponse => {
              const annotationService = annotationServiceResponse.data;
              if (annotationService.attributes.backstage_id && annotationService.attributes.backstage_id !== entityTriplet) {
                RootlyApi.getServices({
                  filter: {
                    backstage_id: annotationService.attributes.backstage_id,
                  },
                }).then(servicesResponse => {
                  const service =
                    servicesResponse &&
                    servicesResponse.data &&
                    servicesResponse.data.length > 0
                      ? servicesResponse.data[0]
                      : null;
                  if (service) {
                    RootlyApi.updateServiceEntity(
                      entity as RootlyEntity,
                      annotationService,
                      service,
                    );
                  }
                });
              } else {
                RootlyApi.updateServiceEntity(
                  entity as RootlyEntity,
                  annotationService,
                );
              }
            })
            .catch(() => {
              if (autoImportService(entity)) {
                RootlyApi.importServiceEntity(entity as RootlyEntity);
              }
            });
        }
      });
    });
  }, []);

  const fetchService = (entity: RootlyEntity) => {
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
        await RootlyApi.getFunctionalities({
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
        await RootlyApi.getTeams({
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
        return { ...entity, id: entityTriplet, linkedService: undefined, linkedFunctionality: undefined, linkedTeam: undefined};
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
