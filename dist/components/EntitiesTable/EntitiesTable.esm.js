import { stringifyEntityRef } from '@backstage/catalog-model';
import { Table, Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { useAsync } from 'react-use';
import { RootlyApiRef } from '../../api.esm.js';
import { ROOTLY_ANNOTATION_SERVICE_ID, ROOTLY_ANNOTATION_SERVICE_SLUG, autoImportService, ROOTLY_ANNOTATION_FUNCTIONALITY_ID, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG } from '../../integration.esm.js';
import { RootlyEntityActionsMenu } from '../Entity/RootlyEntityActionsMenu.esm.js';

const EntitiesTable = () => {
  const catalogApi = useApi(catalogApiRef);
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const [reload, setReload] = useState(false);
  const { value, loading, error } = useAsync(
    async () => await catalogApi.getEntities()
  );
  const handleServiceUpdate = async (entity, service, old_service) => {
    await RootlyApi.updateServiceEntity(entity, service, old_service);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleServiceImport = async (entity) => {
    await RootlyApi.importServiceEntity(entity);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleServiceDelete = async (service) => {
    await RootlyApi.deleteServiceEntity(service);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleFunctionalityUpdate = async (entity, service, old_service) => {
    await RootlyApi.updateFunctionalityEntity(entity, service, old_service);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleFunctionalityImport = async (entity) => {
    await RootlyApi.importFunctionalityEntity(entity);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleFunctionalityDelete = async (service) => {
    await RootlyApi.deleteFunctionalityEntity(service);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleTeamUpdate = async (entity, team, old_team) => {
    await RootlyApi.updateTeamEntity(entity, team, old_team);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleTeamImport = async (entity) => {
    await RootlyApi.importTeamEntity(entity);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleTeamDelete = async (team) => {
    await RootlyApi.deleteTeamEntity(team);
    setTimeout(() => setReload(!reload), 500);
  };
  useEffect(() => {
    catalogApi.getEntities().then((entities) => {
      entities.items.forEach((entity) => {
        const entityTriplet = stringifyEntityRef({
          namespace: entity.metadata.namespace,
          kind: entity.kind,
          name: entity.metadata.name
        });
        const service_id_annotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];
        if (service_id_annotation) {
          RootlyApi.getService(service_id_annotation).then((annotationServiceResponse) => {
            const annotationService = annotationServiceResponse.data;
            if (annotationService.attributes.backstage_id && annotationService.attributes.backstage_id !== entityTriplet) {
              RootlyApi.getServices({
                filter: {
                  backstage_id: annotationService.attributes.backstage_id
                }
              }).then((servicesResponse) => {
                const service = servicesResponse && servicesResponse.data && servicesResponse.data.length > 0 ? servicesResponse.data[0] : null;
                if (service) {
                  RootlyApi.updateServiceEntity(
                    entity,
                    annotationService,
                    service
                  );
                }
              });
            } else {
              RootlyApi.updateServiceEntity(
                entity,
                annotationService
              );
            }
          }).catch(() => {
            if (autoImportService(entity)) {
              RootlyApi.importServiceEntity(entity);
            }
          });
        }
      });
    });
  }, []);
  const fetchService = (entity, reloadService) => {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    const {
      value: response,
      loading: loading2,
      error: error2
    } = useAsync(
      async () => await RootlyApi.getServices({
        filter: {
          backstage_id: entityTriplet
        }
      }),
      [reloadService]
    );
    if (loading2) {
      return /* @__PURE__ */ React.createElement(Progress, null);
    } else if (error2) {
      return /* @__PURE__ */ React.createElement("div", null, "Error");
    }
    if (response && response.data.length > 0) {
      entity.linkedService = response.data[0];
      return /* @__PURE__ */ React.createElement(
        Link,
        {
          target: "blank",
          href: RootlyApi.getServiceDetailsURL(entity.linkedService)
        },
        entity.linkedService.attributes.name
      );
    }
    entity.linkedService = void 0;
    return /* @__PURE__ */ React.createElement("div", null, "Not Linked");
  };
  const fetchFunctionality = (entity, reloadFunc) => {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    const {
      value: response,
      loading: loading2,
      error: error2
    } = useAsync(
      async () => await RootlyApi.getFunctionalities({
        filter: {
          backstage_id: entityTriplet
        }
      }),
      [reloadFunc]
    );
    if (loading2) {
      return /* @__PURE__ */ React.createElement(Progress, null);
    } else if (error2) {
      return /* @__PURE__ */ React.createElement("div", null, "Error");
    }
    if (response && response.data.length > 0) {
      entity.linkedFunctionality = response.data[0];
      return /* @__PURE__ */ React.createElement(
        Link,
        {
          target: "blank",
          href: RootlyApi.getFunctionalityDetailsURL(entity.linkedFunctionality)
        },
        entity.linkedFunctionality.attributes.name
      );
    }
    entity.linkedFunctionality = void 0;
    return /* @__PURE__ */ React.createElement("div", null, "Not Linked");
  };
  const fetchTeam = (entity, reloadTeam) => {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    const {
      value: response,
      loading: loading2,
      error: error2
    } = useAsync(
      async () => await RootlyApi.getTeams({
        filter: {
          backstage_id: entityTriplet
        }
      }),
      [reloadTeam]
    );
    if (loading2) {
      return /* @__PURE__ */ React.createElement(Progress, null);
    } else if (error2) {
      return /* @__PURE__ */ React.createElement("div", null, "Error");
    }
    if (response && response.data.length > 0) {
      entity.linkedTeam = response.data[0];
      return /* @__PURE__ */ React.createElement(
        Link,
        {
          target: "blank",
          href: RootlyApi.getTeamDetailsURL(entity.linkedTeam)
        },
        entity.linkedTeam.attributes.name
      );
    }
    entity.linkedTeam = void 0;
    return /* @__PURE__ */ React.createElement("div", null, "Not Linked");
  };
  const columns = [
    {
      title: "Kind",
      field: "kind",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle
    },
    {
      title: "Name",
      field: "metadata.name",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        return /* @__PURE__ */ React.createElement(EntityRefLink, { entityRef: rowData });
      }
    },
    {
      title: "Description",
      field: "metadata.description",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle
    },
    {
      title: "Rootly Service",
      field: "linked",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        return fetchService(rowData, reload);
      }
    },
    {
      title: "Rootly Functionality",
      field: "linked",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        return fetchFunctionality(rowData, reload);
      }
    },
    {
      title: "Rootly Team",
      field: "linked",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        return fetchTeam(rowData, reload);
      }
    },
    {
      title: "Actions",
      field: "actions",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        const service_id_annotation = rowData.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID] || rowData.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG];
        const functionality_id_annotation = rowData.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID] || rowData.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG];
        const team_id_annotation = rowData.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID] || rowData.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG];
        return service_id_annotation || functionality_id_annotation || team_id_annotation ? /* @__PURE__ */ React.createElement("div", null, "Set through entity file") : /* @__PURE__ */ React.createElement(
          RootlyEntityActionsMenu,
          {
            entity: rowData,
            handleServiceUpdate,
            handleServiceImport,
            handleServiceDelete,
            handleFunctionalityUpdate,
            handleFunctionalityImport,
            handleFunctionalityDelete,
            handleTeamUpdate,
            handleTeamImport,
            handleTeamDelete
          }
        );
      }
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = value ? value.items.map((entity) => {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name
    });
    return { ...entity, id: entityTriplet, linkedService: void 0, linkedFunctionality: void 0, linkedTeam: void 0 };
  }) : [];
  return /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: true,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: 25,
        pageSizeOptions: [25, 50, 100, 150, 200],
        padding: "dense"
      },
      localization: { header: { actions: void 0 } },
      columns,
      data
    }
  );
};

export { EntitiesTable };
//# sourceMappingURL=EntitiesTable.esm.js.map
