import React, { useState, useEffect, Children, isValidElement, Fragment } from 'react';
import { useOutlet } from 'react-router';
import { catalogApiRef, EntityRefLink, EntityListProvider } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Table, Progress, Page, Header, RoutedTabs } from '@backstage/core-components';
import { useApi, attachComponentData } from '@backstage/core-plugin-api';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import { useAsync } from 'react-use';
import { R as RootlyApiRef, S as ServicesDialog, a as ROOTLY_ANNOTATION_SERVICE_ID, b as ROOTLY_ANNOTATION_SERVICE_SLUG, c as autoImportService, I as IncidentsTable, d as ServicesTable } from './index-bc187665.esm.js';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SyncIcon from '@material-ui/icons/Sync';
import Delete from '@material-ui/icons/Delete';
import '@material-ui/core/Divider';
import 'qs';

const EntityActionsMenu = ({
  entity,
  handleUpdate,
  handleImport,
  handleDelete
}) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDialog = async () => {
    setOpenDialog(false);
  };
  const handleCloseImport = async (entity2) => {
    setOpenDialog(false);
    handleImport(entity2);
  };
  const handleCloseUpdate = async (entity2, old_service, service) => {
    setOpenDialog(false);
    handleUpdate(entity2, old_service, service);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenServicesDialog = async () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, openDialog && /* @__PURE__ */ React.createElement(
    ServicesDialog,
    {
      open: openDialog,
      entity,
      handleClose: handleCloseDialog,
      handleImport: handleCloseImport,
      handleUpdate: handleCloseUpdate
    }
  ), /* @__PURE__ */ React.createElement(
    IconButton,
    {
      "aria-label": "more",
      "aria-controls": "long-menu",
      "aria-haspopup": "true",
      onClick: handleClick
    },
    /* @__PURE__ */ React.createElement(MoreVertIcon, null)
  ), /* @__PURE__ */ React.createElement(
    Menu,
    {
      id: `actions-menu-${entityTriplet}`,
      anchorEl,
      keepMounted: true,
      open: Boolean(anchorEl),
      onClose: handleCloseMenu,
      PaperProps: {
        style: { maxHeight: 48 * 4.5 }
      }
    },
    !entity.linkedService && /* @__PURE__ */ React.createElement(MenuItem, { key: "import", onClick: handleOpenServicesDialog }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SyncIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Import service in Rootly")),
    /* @__PURE__ */ React.createElement(MenuItem, { key: "link", onClick: handleOpenServicesDialog }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SyncIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Link to another Rootly service")),
    entity.linkedService && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      MenuItem,
      {
        key: "unlink",
        onClick: () => handleDelete(entity.linkedService)
      },
      /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Delete, { fontSize: "small" })),
      /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Unlink")
    ), /* @__PURE__ */ React.createElement(MenuItem, { key: "details", onClick: handleCloseMenu }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(OpenInNewIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, /* @__PURE__ */ React.createElement(
      Link,
      {
        target: "blank",
        href: RootlyApi.getServiceDetailsURL(entity.linkedService)
      },
      "View in Rootly"
    ))))
  ));
};

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
  const handleUpdate = async (entity, service, old_service) => {
    await RootlyApi.updateEntity(entity, service, old_service);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleImport = async (entity) => {
    await RootlyApi.importEntity(entity);
    setTimeout(() => setReload(!reload), 500);
  };
  const handleDelete = async (service) => {
    await RootlyApi.deleteEntity(service);
    setTimeout(() => setReload(!reload), 500);
  };
  useEffect(() => {
    catalogApi.getEntities().then((entities) => {
      entities.items.forEach((entity) => {
        var _a, _b;
        const entityTriplet = stringifyEntityRef({
          namespace: entity.metadata.namespace,
          kind: entity.kind,
          name: entity.metadata.name
        });
        const service_id_annotation = ((_a = entity.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_SERVICE_ID]) || ((_b = entity.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_SERVICE_SLUG]);
        if (service_id_annotation) {
          RootlyApi.getService(service_id_annotation).then((annotationServiceResponse) => {
            const annotationService = annotationServiceResponse.data;
            if (annotationService.attributes.backstage_id && annotationService.attributes.backstage_id != entityTriplet) {
              RootlyApi.getServices({
                filter: {
                  backstage_id: annotationService.attributes.backstage_id
                }
              }).then((servicesResponse) => {
                const service = servicesResponse && servicesResponse.data && servicesResponse.data.length > 0 ? servicesResponse.data[0] : null;
                if (service) {
                  RootlyApi.updateEntity(
                    entity,
                    annotationService,
                    service
                  );
                }
              });
            } else {
              RootlyApi.updateEntity(
                entity,
                annotationService
              );
            }
          }).catch(() => {
            if (autoImportService(entity)) {
              RootlyApi.importEntity(entity);
            }
          });
        }
      });
    });
  }, []);
  const fetchService = (entity, reload2) => {
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
      [reload2]
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
    } else {
      entity.linkedService = void 0;
      return /* @__PURE__ */ React.createElement("div", null, "Not Linked");
    }
  };
  const columns = [
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
      title: "Actions",
      field: "actions",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        var _a, _b;
        const service_id_annotation = ((_a = rowData.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_SERVICE_ID]) || ((_b = rowData.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_SERVICE_SLUG]);
        return service_id_annotation ? /* @__PURE__ */ React.createElement("div", null, "Set through entity file") : /* @__PURE__ */ React.createElement(
          EntityActionsMenu,
          {
            entity: rowData,
            handleUpdate,
            handleImport,
            handleDelete
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
    return { ...entity, id: entityTriplet, linkedService: void 0 };
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

const EntitiesList = () => {
  return /* @__PURE__ */ React.createElement(EntityListProvider, null, /* @__PURE__ */ React.createElement(EntitiesTable, null));
};

const Route = () => null;
attachComponentData(Route, "core.gatherMountPoints", true);
function createSubRoutesFromChildren(childrenProps) {
  const routeType = (/* @__PURE__ */ React.createElement(Route, { path: "", title: "" }, /* @__PURE__ */ React.createElement("div", null))).type;
  return Children.toArray(childrenProps).flatMap((child) => {
    if (!isValidElement(child)) {
      return [];
    }
    if (child.type === Fragment) {
      return createSubRoutesFromChildren(child.props.children);
    }
    if (child.type !== routeType) {
      throw new Error("Child of ExploreLayout must be an ExploreLayout.Route");
    }
    const { path, title, children, tabProps } = child.props;
    return [{ path, title, children, tabProps }];
  });
}
const DefaultRootlyPageLayout = ({ children }) => {
  const routes = createSubRoutesFromChildren(children);
  return /* @__PURE__ */ React.createElement(Page, { themeId: "tool" }, /* @__PURE__ */ React.createElement(Header, { title: "Rootly" }), /* @__PURE__ */ React.createElement(RoutedTabs, { routes }));
};
DefaultRootlyPageLayout.Route = Route;

const DefaultRootlyPage = () => {
  return /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout, null, /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "incidents", title: "Incidents" }, /* @__PURE__ */ React.createElement(
    IncidentsTable,
    {
      params: {
        include: "environments,services,functionalities,groups,incident_types"
      }
    }
  )), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "entities", title: "Entities" }, /* @__PURE__ */ React.createElement(EntitiesList, null)), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "services", title: "Services" }, /* @__PURE__ */ React.createElement(ServicesTable, null)));
};

const RootlyPage = () => {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultRootlyPage, null);
};

export { DefaultRootlyPageLayout, RootlyPage };
//# sourceMappingURL=index-587cd746.esm.js.map
