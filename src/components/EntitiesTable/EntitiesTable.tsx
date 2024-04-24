import { stringifyEntityRef } from '@backstage/catalog-model';
import { Progress, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { RootlyApiRef } from '../../api';
import {
  autoImportService,
  ROOTLY_ANNOTATION_SERVICE_ID,
  ROOTLY_ANNOTATION_SERVICE_SLUG,
  ROOTLY_ANNOTATION_FUNCTIONALITY_ID,
  ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG,
  ROOTLY_ANNOTATION_TEAM_ID,
  ROOTLY_ANNOTATION_TEAM_SLUG,
} from '../../integration';
import { Entity, Service, Functionality, Team } from '../../types';
import { RootlyEntityActionsMenu } from '../Entity/RootlyEntityActionsMenu';

export const EntitiesTable = () => {
  const catalogApi = useApi(catalogApiRef);
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: '5%',
    maxWidth: '5%',
  };

  const [reload, setReload] = useState(false);

  const { value, loading, error } = useAsync(
    async () => await catalogApi.getEntities(),
  );

  const handleServiceUpdate = async (
    entity: Entity,
    service: Service,
    old_service?: Service,
  ) => {
    await RootlyApi.updateServiceEntity(entity, service, old_service);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleServiceImport = async (entity: Entity) => {
    await RootlyApi.importServiceEntity(entity);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleServiceDelete = async (service: Service) => {
    await RootlyApi.deleteServiceEntity(service);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleFunctionalityUpdate = async (
    entity: Entity,
    service: Functionality,
    old_service?: Functionality,
  ) => {
    await RootlyApi.updateFunctionalityEntity(entity, service, old_service);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleFunctionalityImport = async (entity: Entity) => {
    await RootlyApi.importFunctionalityEntity(entity);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleFunctionalityDelete = async (service: Functionality) => {
    await RootlyApi.deleteFunctionalityEntity(service);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleTeamUpdate = async (
    entity: Entity,
    team: Team,
    old_team?: Team,
  ) => {
    await RootlyApi.updateTeamEntity(entity, team, old_team);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleTeamImport = async (entity: Entity) => {
    await RootlyApi.importTeamEntity(entity);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleTeamDelete = async (team: Team) => {
    await RootlyApi.deleteTeamEntity(team);
    setTimeout(() => setReload(!reload), 500);
  };

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
                      entity as Entity,
                      annotationService,
                      service,
                    );
                  }
                });
              } else {
                RootlyApi.updateServiceEntity(
                  entity as Entity,
                  annotationService,
                );
              }
            })
            .catch(() => {
              if (autoImportService(entity)) {
                RootlyApi.importServiceEntity(entity as Entity);
              }
            });
        }
      });
    });
  }, []);

  const fetchService = (entity: Entity, reload: boolean) => {
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
      return <div>Error</div>;
    }
    if (response && response.data.length > 0) {
      entity.linkedService = response.data[0] as Service;
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

  const fetchFunctionality = (entity: Entity, reload: boolean) => {
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
      [reload],
    );
    if (loading) {
      return <Progress />;
    } else if (error) {
      return <div>Error</div>;
    }
    if (response && response.data.length > 0) {
      entity.linkedFunctionality = response.data[0] as Functionality;
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

  const fetchTeam = (entity: Entity, reload: boolean) => {
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
      [reload],
    );
    if (loading) {
      return <Progress />;
    } else if (error) {
      return <div>Error</div>;
    }
    if (response && response.data.length > 0) {
      entity.linkedTeam = response.data[0] as Team;
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

  const columns: TableColumn<Entity>[] = [
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
        return fetchService(rowData, reload);
      },
    },
    {
      title: 'Rootly Functionality',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => {
        return fetchFunctionality(rowData, reload);
      },
    },
    {
      title: 'Rootly Team',
      field: 'linked',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => {
        return fetchTeam(rowData, reload);
      },
    },
    {
      title: 'Actions',
      field: 'actions',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => {
        const service_id_annotation =
          rowData.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] ||
          rowData.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];

        const functionality_id_annotation =
          rowData.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] ||
          rowData.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];

        const team_id_annotation =
          rowData.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] ||
          rowData.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];

        return service_id_annotation || functionality_id_annotation || team_id_annotation ? (
          <div>Set through entity file</div>
        ) : (
          <RootlyEntityActionsMenu
            entity={rowData}
            handleServiceUpdate={handleServiceUpdate}
            handleServiceImport={handleServiceImport}
            handleServiceDelete={handleServiceDelete}
            handleFunctionalityUpdate={handleFunctionalityUpdate}
            handleFunctionalityImport={handleFunctionalityImport}
            handleFunctionalityDelete={handleFunctionalityDelete}
            handleTeamUpdate={handleTeamUpdate}
            handleTeamImport={handleTeamImport}
            handleTeamDelete={handleTeamDelete}
          />
        );
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
