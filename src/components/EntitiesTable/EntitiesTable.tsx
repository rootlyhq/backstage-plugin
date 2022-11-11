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
} from '../../integration';
import { Entity, Service } from '../../types';
import { EntityActionsMenu } from '../Entity/EntityActionsMenu';

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

  const handleUpdate = async (
    entity: Entity,
    old_service: Service,
    service: Service,
  ) => {
    await RootlyApi.updateEntity(entity, old_service, service);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleImport = async (entity: Entity) => {
    await RootlyApi.importEntity(entity);
    setTimeout(() => setReload(!reload), 500);
  };

  const handleDelete = async (service: Service) => {
    await RootlyApi.deleteEntity(service);
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
              // if(entityTriplet.includes('search')) { debugger }
              if (annotationService.attributes.backstage_id && annotationService.attributes.backstage_id != entityTriplet) {
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
                    RootlyApi.updateEntity(
                      entity as Entity,
                      annotationService,
                      service,
                    );
                  }
                });
              }
            })
            .catch(() => {
              if (autoImportService(entity)) {
                RootlyApi.importEntity(entity as Entity);
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
    } else {
      entity.linkedService = undefined;
      return <div>Not Linked</div>;
    }
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
      title: 'Actions',
      field: 'actions',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => {
        const service_id_annotation =
          rowData.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] ||
          rowData.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];

        return service_id_annotation ? (
          <div>Set through entity file</div>
        ) : (
          <EntityActionsMenu
            entity={rowData}
            handleUpdate={handleUpdate}
            handleImport={handleImport}
            handleDelete={handleDelete}
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
        return { ...entity, id: entityTriplet, linkedService: undefined };
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
