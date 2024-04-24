import React, { useState, useEffect, useCallback, Children, isValidElement, Fragment } from 'react';
import { useOutlet } from 'react-router';
import { catalogApiRef, EntityRefLink, EntityListProvider } from '@backstage/plugin-catalog-react';
import { stringifyEntityRef, parseEntityRef } from '@backstage/catalog-model';
import { Select, Table, Progress, Page, Header, RoutedTabs } from '@backstage/core-components';
import { useApi, attachComponentData } from '@backstage/core-plugin-api';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import { useAsync } from 'react-use';
import { R as RootlyApiRef, S as ServicesDialog, a as ROOTLY_ANNOTATION_SERVICE_ID, b as ROOTLY_ANNOTATION_SERVICE_SLUG, c as autoImportService, d as ROOTLY_ANNOTATION_FUNCTIONALITY_ID, e as ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, f as ROOTLY_ANNOTATION_TEAM_ID, g as ROOTLY_ANNOTATION_TEAM_SLUG, I as IncidentsTable, h as ServicesTable } from './index-CSqOVTPz.esm.js';
import { Dialog, DialogTitle, DialogContent, Box, Button, Typography, DialogActions, IconButton, Menu, MenuItem, ListItemIcon, makeStyles, Tooltip } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SyncIcon from '@material-ui/icons/Sync';
import Delete from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import 'qs';

const FunctionalitiesDialog = ({
  open,
  entity,
  handleClose,
  handleImport,
  handleUpdate
}) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [selectedItem, setSelectedItem] = useState("");
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getFunctionalities({
      filter: {
        backstage_id: null
      },
      page: { size: 999 }
    })
  );
  const data = response ? response.data : [];
  useEffect(() => {
    var _a;
    if (entity && data) {
      const entityTriplet = stringifyEntityRef({
        namespace: entity.metadata.namespace,
        kind: entity.kind,
        name: entity.metadata.name
      });
      const item = (_a = data.find(
        (s) => s.attributes.backstage_id === entityTriplet
      )) == null ? void 0 : _a.id;
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [data]);
  const onSelectedFunctionalityChanged = (newSelectedItem) => {
    setSelectedItem(newSelectedItem);
  };
  const onImportAsNewFunctionalityButtonClicked = () => {
    handleImport(entity);
  };
  const onLinkToExistingFunctionalityButtonClicked = () => {
    var _a;
    handleUpdate(
      entity,
      { id: selectedItem },
      { id: (_a = entity.linkedFunctionality) == null ? void 0 : _a.id }
    );
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  return /* @__PURE__ */ React.createElement(
    Dialog,
    {
      open,
      onClose: handleClose,
      "aria-labelledby": "dialog-title",
      "aria-describedby": "dialog-description"
    },
    /* @__PURE__ */ React.createElement(DialogTitle, { id: "dialog-title" }, "Functionalities"),
    /* @__PURE__ */ React.createElement(DialogContent, null, entity && !entity.linkedFunctionality && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, { sx: { mx: "auto" }, mb: 2 }, /* @__PURE__ */ React.createElement(
      Button,
      {
        color: "primary",
        variant: "contained",
        onClick: onImportAsNewFunctionalityButtonClicked
      },
      "Import as new Functionality"
    )), /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(Box, { sx: { mx: "auto" }, mt: 2 }, /* @__PURE__ */ React.createElement(Typography, null, "Select a Rootly Functionality you want to map this component to:"), /* @__PURE__ */ React.createElement(
      Select,
      {
        onChange: onSelectedFunctionalityChanged,
        selected: selectedItem,
        placeholder: "Select",
        label: "Functionalities",
        items: (data || []).map((functionality) => {
          return {
            label: functionality.attributes.name,
            value: functionality.id
          };
        })
      }
    ))),
    /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, { color: "primary", onClick: onLinkToExistingFunctionalityButtonClicked }, "Link"))
  );
};

const TeamsDialog = ({
  open,
  entity,
  handleClose,
  handleImport,
  handleUpdate
}) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [selectedItem, setSelectedItem] = useState("");
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getTeams({
      filter: {
        backstage_id: null
      },
      page: { size: 999 }
    })
  );
  const data = response ? response.data : [];
  useEffect(() => {
    var _a;
    if (entity && data) {
      const entityTriplet = stringifyEntityRef({
        namespace: entity.metadata.namespace,
        kind: entity.kind,
        name: entity.metadata.name
      });
      const item = (_a = data.find(
        (s) => s.attributes.backstage_id === entityTriplet
      )) == null ? void 0 : _a.id;
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [data]);
  const onSelectedTeamChanged = (newSelectedItem) => {
    setSelectedItem(newSelectedItem);
  };
  const onImportAsNewTeamButtonClicked = () => {
    handleImport(entity);
  };
  const onLinkToExistingTeamButtonClicked = () => {
    var _a;
    handleUpdate(
      entity,
      { id: selectedItem },
      { id: (_a = entity.linkedTeam) == null ? void 0 : _a.id }
    );
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  return /* @__PURE__ */ React.createElement(
    Dialog,
    {
      open,
      onClose: handleClose,
      "aria-labelledby": "dialog-title",
      "aria-describedby": "dialog-description"
    },
    /* @__PURE__ */ React.createElement(DialogTitle, { id: "dialog-title" }, "Teams"),
    /* @__PURE__ */ React.createElement(DialogContent, null, entity && !entity.linkedTeam && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, { sx: { mx: "auto" }, mb: 2 }, /* @__PURE__ */ React.createElement(
      Button,
      {
        color: "primary",
        variant: "contained",
        onClick: onImportAsNewTeamButtonClicked
      },
      "Import as new Team"
    )), /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(Box, { sx: { mx: "auto" }, mt: 2 }, /* @__PURE__ */ React.createElement(Typography, null, "Select a Rootly Team you want to map this component to:"), /* @__PURE__ */ React.createElement(
      Select,
      {
        onChange: onSelectedTeamChanged,
        selected: selectedItem,
        placeholder: "Select",
        label: "Teams",
        items: (data || []).map((team) => {
          return {
            label: team.attributes.name,
            value: team.id
          };
        })
      }
    ))),
    /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, { color: "primary", onClick: onLinkToExistingTeamButtonClicked }, "Link"))
  );
};

const RootlyEntityActionsMenu = ({
  entity,
  handleServiceUpdate,
  handleServiceImport,
  handleServiceDelete,
  handleFunctionalityUpdate,
  handleFunctionalityImport,
  handleFunctionalityDelete,
  handleTeamUpdate,
  handleTeamImport,
  handleTeamDelete
}) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openFunctionalityDialog, setOpenFunctionalityDialog] = useState(false);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseServiceDialog = async () => {
    setOpenServiceDialog(false);
  };
  const handleCloseServiceImport = async (entity2) => {
    setOpenServiceDialog(false);
    handleServiceImport(entity2);
  };
  const handleCloseServiceUpdate = async (entity2, old_service, service) => {
    setOpenServiceDialog(false);
    handleServiceUpdate(entity2, old_service, service);
  };
  const handleCloseServiceMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenServicesDialog = async () => {
    setAnchorEl(null);
    setOpenServiceDialog(true);
  };
  const handleCloseFunctionalityDialog = async () => {
    setOpenFunctionalityDialog(false);
  };
  const handleCloseFunctionalityImport = async (entity2) => {
    setOpenFunctionalityDialog(false);
    handleFunctionalityImport(entity2);
  };
  const handleCloseFunctionalityUpdate = async (entity2, old_functionality, functionality) => {
    setOpenFunctionalityDialog(false);
    handleFunctionalityUpdate(entity2, old_functionality, functionality);
  };
  const handleCloseFunctionalityMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenFunctionalitiesDialog = async () => {
    setAnchorEl(null);
    setOpenFunctionalityDialog(true);
  };
  const handleCloseTeamDialog = async () => {
    setOpenTeamDialog(false);
  };
  const handleCloseTeamImport = async (entity2) => {
    setOpenTeamDialog(false);
    handleTeamImport(entity2);
  };
  const handleCloseTeamUpdate = async (entity2, old_team, team) => {
    setOpenTeamDialog(false);
    handleTeamUpdate(entity2, old_team, team);
  };
  const handleCloseTeamMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenTeamsDialog = async () => {
    setAnchorEl(null);
    setOpenTeamDialog(true);
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, openServiceDialog && /* @__PURE__ */ React.createElement(
    ServicesDialog,
    {
      open: openServiceDialog,
      entity,
      handleClose: handleCloseServiceDialog,
      handleImport: handleCloseServiceImport,
      handleUpdate: handleCloseServiceUpdate
    }
  ), openFunctionalityDialog && /* @__PURE__ */ React.createElement(
    FunctionalitiesDialog,
    {
      open: openFunctionalityDialog,
      entity,
      handleClose: handleCloseFunctionalityDialog,
      handleImport: handleCloseFunctionalityImport,
      handleUpdate: handleCloseFunctionalityUpdate
    }
  ), openTeamDialog && /* @__PURE__ */ React.createElement(
    TeamsDialog,
    {
      open: openTeamDialog,
      entity,
      handleClose: handleCloseTeamDialog,
      handleImport: handleCloseTeamImport,
      handleUpdate: handleCloseTeamUpdate
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
      onClose: handleCloseServiceMenu,
      PaperProps: {
        style: { maxHeight: 48 * 4.5 }
      }
    },
    !entity.linkedService && /* @__PURE__ */ React.createElement(MenuItem, { key: "import", onClick: handleOpenServicesDialog }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SyncIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Import as a Service in Rootly")),
    /* @__PURE__ */ React.createElement(MenuItem, { key: "link", onClick: handleOpenServicesDialog }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SyncIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Link to another Rootly service")),
    entity.linkedService && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      MenuItem,
      {
        key: "unlink",
        onClick: () => handleServiceDelete(entity.linkedService)
      },
      /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Delete, { fontSize: "small" })),
      /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Unlink")
    ), /* @__PURE__ */ React.createElement(MenuItem, { key: "details", onClick: handleCloseServiceMenu }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(OpenInNewIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, /* @__PURE__ */ React.createElement(
      Link,
      {
        target: "blank",
        href: RootlyApi.getServiceDetailsURL(entity.linkedService)
      },
      "View in Rootly"
    )))),
    /* @__PURE__ */ React.createElement(MenuItem, { divider: true }),
    !entity.linkedFunctionality && /* @__PURE__ */ React.createElement(MenuItem, { key: "import", onClick: handleOpenFunctionalitiesDialog }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SyncIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Import as a Functionality in Rootly")),
    /* @__PURE__ */ React.createElement(MenuItem, { key: "link", onClick: handleOpenFunctionalitiesDialog }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SyncIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Link to another Rootly functionality")),
    entity.linkedFunctionality && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      MenuItem,
      {
        key: "unlink",
        onClick: () => handleFunctionalityDelete(entity.linkedFunctionality)
      },
      /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Delete, { fontSize: "small" })),
      /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Unlink")
    ), /* @__PURE__ */ React.createElement(MenuItem, { key: "details", onClick: handleCloseFunctionalityMenu }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(OpenInNewIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, /* @__PURE__ */ React.createElement(
      Link,
      {
        target: "blank",
        href: RootlyApi.getFunctionalityDetailsURL(
          entity.linkedFunctionality
        )
      },
      "View in Rootly"
    )))),
    /* @__PURE__ */ React.createElement(MenuItem, { divider: true }),
    !entity.linkedTeam && /* @__PURE__ */ React.createElement(MenuItem, { key: "import", onClick: handleOpenTeamsDialog }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SyncIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Import as a Team in Rootly")),
    /* @__PURE__ */ React.createElement(MenuItem, { key: "link", onClick: handleOpenTeamsDialog }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(SyncIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Link to another Rootly team")),
    entity.linkedTeam && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      MenuItem,
      {
        key: "unlink",
        onClick: () => handleTeamDelete(entity.linkedTeam)
      },
      /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Delete, { fontSize: "small" })),
      /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, "Unlink")
    ), /* @__PURE__ */ React.createElement(MenuItem, { key: "details", onClick: handleCloseTeamMenu }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(OpenInNewIcon, { fontSize: "small" })), /* @__PURE__ */ React.createElement(Typography, { variant: "inherit", noWrap: true }, /* @__PURE__ */ React.createElement(
      Link,
      {
        target: "blank",
        href: RootlyApi.getTeamDetailsURL(entity.linkedTeam)
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
        var _a, _b, _c, _d, _e, _f;
        const service_id_annotation = ((_a = rowData.metadata.annotations) == null ? void 0 : _a[ROOTLY_ANNOTATION_SERVICE_ID]) || ((_b = rowData.metadata.annotations) == null ? void 0 : _b[ROOTLY_ANNOTATION_SERVICE_SLUG]);
        const functionality_id_annotation = ((_c = rowData.metadata.annotations) == null ? void 0 : _c[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) || ((_d = rowData.metadata.annotations) == null ? void 0 : _d[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]);
        const team_id_annotation = ((_e = rowData.metadata.annotations) == null ? void 0 : _e[ROOTLY_ANNOTATION_TEAM_ID]) || ((_f = rowData.metadata.annotations) == null ? void 0 : _f[ROOTLY_ANNOTATION_TEAM_SLUG]);
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

const EntitiesList = () => {
  return /* @__PURE__ */ React.createElement(EntityListProvider, null, /* @__PURE__ */ React.createElement(EntitiesTable, null));
};

const useStyles$1 = makeStyles((theme) => ({
  container: {
    width: 850
  },
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const DEFAULT_PAGE_NUMBER$1 = 1;
const DEFAULT_PAGE_SIZE$1 = 10;
const FunctionalitiesTable = ({ params }) => {
  const classes = useStyles$1();
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const mediumColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER$1,
    size: DEFAULT_PAGE_SIZE$1
  });
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getFunctionalities({ ...params, page }),
    [page]
  );
  const nameColumn = useCallback((rowData) => {
    var _a;
    return /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: ((_a = rowData.attributes.description) == null ? void 0 : _a.substring(0, 255)) || rowData.attributes.name
      },
      /* @__PURE__ */ React.createElement(Link, { target: "blank", href: RootlyApi.getFunctionalityDetailsURL(rowData) }, rowData.attributes.name)
    );
  }, []);
  const backstageColumn = useCallback((rowData) => {
    if (rowData.attributes.backstage_id) {
      return /* @__PURE__ */ React.createElement(
        EntityRefLink,
        {
          entityRef: parseEntityRef(rowData.attributes.backstage_id)
        }
      );
    }
    return /* @__PURE__ */ React.createElement("div", null, "N/A");
  }, []);
  const columns = [
    {
      title: "Name",
      field: "name",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: nameColumn
    },
    {
      title: "Backstage",
      field: "backstage",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: backstageColumn
    },
    {
      title: "Incidents",
      field: "attributes.incidents_count",
      type: "numeric",
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Updated At",
      field: "attributes.updated_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Created At",
      field: "attributes.created_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = response ? response.data : [];
  return /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: false,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: DEFAULT_PAGE_SIZE$1,
        padding: "dense"
      },
      localization: { header: { actions: void 0 } },
      columns,
      data,
      page: page.number - 1,
      totalCount: response == null ? void 0 : response.meta.total_count,
      emptyContent: /* @__PURE__ */ React.createElement("div", { className: classes.empty }, "No functionalities"),
      onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
      onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
    }
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: 850
  },
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const TeamsTable = ({ params }) => {
  const classes = useStyles();
  const RootlyApi = useApi(RootlyApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const mediumColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER,
    size: DEFAULT_PAGE_SIZE
  });
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getTeams({ ...params, page }),
    [page]
  );
  const nameColumn = useCallback((rowData) => {
    var _a;
    return /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: ((_a = rowData.attributes.description) == null ? void 0 : _a.substring(0, 255)) || rowData.attributes.name
      },
      /* @__PURE__ */ React.createElement(Link, { target: "blank", href: RootlyApi.getTeamDetailsURL(rowData) }, rowData.attributes.name)
    );
  }, []);
  const backstageColumn = useCallback((rowData) => {
    if (rowData.attributes.backstage_id) {
      return /* @__PURE__ */ React.createElement(
        EntityRefLink,
        {
          entityRef: parseEntityRef(rowData.attributes.backstage_id)
        }
      );
    }
    return /* @__PURE__ */ React.createElement("div", null, "N/A");
  }, []);
  const columns = [
    {
      title: "Name",
      field: "name",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: nameColumn
    },
    {
      title: "Backstage",
      field: "backstage",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: backstageColumn
    },
    {
      title: "Incidents",
      field: "attributes.incidents_count",
      type: "numeric",
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Updated At",
      field: "attributes.updated_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Created At",
      field: "attributes.created_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = response ? response.data : [];
  return /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: false,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: DEFAULT_PAGE_SIZE,
        padding: "dense"
      },
      localization: { header: { actions: void 0 } },
      columns,
      data,
      page: page.number - 1,
      totalCount: response == null ? void 0 : response.meta.total_count,
      emptyContent: /* @__PURE__ */ React.createElement("div", { className: classes.empty }, "No teams"),
      onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
      onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
    }
  );
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
  )), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "entities", title: "Entities" }, /* @__PURE__ */ React.createElement(EntitiesList, null)), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "services", title: "Services" }, /* @__PURE__ */ React.createElement(ServicesTable, null)), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "functionalities", title: "Functionalities" }, /* @__PURE__ */ React.createElement(FunctionalitiesTable, null)), /* @__PURE__ */ React.createElement(DefaultRootlyPageLayout.Route, { path: "teams", title: "Teams" }, /* @__PURE__ */ React.createElement(TeamsTable, null)));
};

const RootlyPage = () => {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultRootlyPage, null);
};

export { DefaultRootlyPageLayout, RootlyPage };
//# sourceMappingURL=index-CaxKWd0o.esm.js.map
