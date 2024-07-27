import { useApi } from '@backstage/core-plugin-api';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SyncIcon from '@material-ui/icons/Sync';
import Delete from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import { RootlyApiRef } from '../../api.esm.js';
import { ServicesDialog } from '../ServicesDialog/ServicesDialog.esm.js';
import { FunctionalitiesDialog } from '../FunctionalitiesDialog/FunctionalitiesDialog.esm.js';
import { TeamsDialog } from '../TeamsDialog/TeamsDialog.esm.js';
import { stringifyEntityRef } from '@backstage/catalog-model';

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

export { RootlyEntityActionsMenu };
//# sourceMappingURL=RootlyEntityActionsMenu.esm.js.map
