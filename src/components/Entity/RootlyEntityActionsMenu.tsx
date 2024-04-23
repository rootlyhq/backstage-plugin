import { useApi } from '@backstage/core-plugin-api';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SyncIcon from '@material-ui/icons/Sync';
import Delete from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import { RootlyApiRef } from '../../api';
import { Entity, Service, Functionality } from '../../types';
import { ServicesDialog } from '../ServicesDialog';
import { FunctionalitiesDialog } from '../FunctionalitiesDialog';
import { stringifyEntityRef } from '@backstage/catalog-model';

export const RootlyEntityActionsMenu = ({
  entity,
  handleServiceUpdate,
  handleServiceImport,
  handleServiceDelete,
  handleFunctionalityUpdate,
  handleFunctionalityImport,
  handleFunctionalityDelete,
}: {
  entity: Entity;
  handleServiceUpdate: Function;
  handleServiceImport: Function;
  handleServiceDelete: Function;
  handleFunctionalityUpdate: Function;
  handleFunctionalityImport: Function;
  handleFunctionalityDelete: Function;
}) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openFunctionalityDialog, setOpenFunctionalityDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseServiceDialog = async () => {
    setOpenServiceDialog(false);
  };

  const handleCloseServiceImport = async (entity: Entity) => {
    setOpenServiceDialog(false);
    handleServiceImport(entity);
  };

  const handleCloseServiceUpdate = async (
    entity: Entity,
    old_service: Service,
    service: Service,
  ) => {
    setOpenServiceDialog(false);
    handleServiceUpdate(entity, old_service, service);
  };

  const handleCloseServiceMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenServicesDialog = async (): Promise<void> => {
    setAnchorEl(null);
    setOpenServiceDialog(true);
  };

  const handleCloseFunctionalityDialog = async () => {
    setOpenFunctionalityDialog(false);
  };

  const handleCloseFunctionalityImport = async (entity: Entity) => {
    setOpenFunctionalityDialog(false);
    handleFunctionalityImport(entity);
  };

  const handleCloseFunctionalityUpdate = async (
    entity: Entity,
    old_functionality: Functionality,
    functionality: Functionality,
  ) => {
    setOpenFunctionalityDialog(false);
    handleFunctionalityUpdate(entity, old_functionality, functionality);
  };

  const handleCloseFunctionalityMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenFunctionalitiesDialog = async (): Promise<void> => {
    setAnchorEl(null);
    setOpenFunctionalityDialog(true);
  };

  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name,
  });

  return (
    <>
      {openServiceDialog && (
        <ServicesDialog
          open={openServiceDialog}
          entity={entity}
          handleClose={handleCloseServiceDialog}
          handleImport={handleCloseServiceImport}
          handleUpdate={handleCloseServiceUpdate}
        />
      )}
      {openFunctionalityDialog && (
        <FunctionalitiesDialog
          open={openFunctionalityDialog}
          entity={entity}
          handleClose={handleCloseFunctionalityDialog}
          handleImport={handleCloseFunctionalityImport}
          handleUpdate={handleCloseFunctionalityUpdate}
        />
      )}
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`actions-menu-${entityTriplet}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseServiceMenu}
        PaperProps={{
          style: { maxHeight: 48 * 4.5 },
        }}
      >
        {!entity.linkedService && (
          <MenuItem key="import" onClick={handleOpenServicesDialog}>
            <ListItemIcon>
              <SyncIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Import as a Service in Rootly
            </Typography>
          </MenuItem>
        )}

        <MenuItem key="link" onClick={handleOpenServicesDialog}>
          <ListItemIcon>
            <SyncIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Link to another Rootly service
          </Typography>
        </MenuItem>

        {entity.linkedService && (
          <>
            <MenuItem
              key="unlink"
              onClick={() => handleServiceDelete(entity.linkedService)}
            >
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                Unlink
              </Typography>
            </MenuItem>
            <MenuItem key="details" onClick={handleCloseServiceMenu}>
              <ListItemIcon>
                <OpenInNewIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                <Link
                  target="blank"
                  href={RootlyApi.getServiceDetailsURL(entity.linkedService)}
                >
                  View in Rootly
                </Link>
              </Typography>
            </MenuItem>
          </>
        )}

        <MenuItem divider />

        {!entity.linkedFunctionality && (
          <MenuItem key="import" onClick={handleOpenFunctionalitiesDialog}>
            <ListItemIcon>
              <SyncIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Import as a Functionality in Rootly
            </Typography>
          </MenuItem>
        )}

        <MenuItem key="link" onClick={handleOpenFunctionalitiesDialog}>
          <ListItemIcon>
            <SyncIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Link to another Rootly functionality
          </Typography>
        </MenuItem>

        {entity.linkedFunctionality && (
          <>
            <MenuItem
              key="unlink"
              onClick={() => handleFunctionalityDelete(entity.linkedFunctionality)}
            >
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                Unlink
              </Typography>
            </MenuItem>
            <MenuItem key="details" onClick={handleCloseFunctionalityMenu}>
              <ListItemIcon>
                <OpenInNewIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                <Link
                  target="blank"
                  href={RootlyApi.getFunctionalityDetailsURL(
                    entity.linkedFunctionality,
                  )}
                >
                  View in Rootly
                </Link>
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};
