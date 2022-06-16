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
import { Entity, Service } from '../../types';
import { ServicesDialog } from '../ServicesDialog';
import { stringifyEntityRef } from '@backstage/catalog-model';

export const EntityActionsMenu = ({
  entity,
  handleUpdate,
  handleImport,
  handleDelete,
}: {
  entity: Entity;
  handleUpdate: Function;
  handleImport: Function;
  handleDelete: Function;
}) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDialog = async () => {
    setOpenDialog(false);
  };

  const handleCloseImport = async (entity: Entity) => {
    setOpenDialog(false);
    handleImport(entity);
  };

  const handleCloseUpdate = async (
    entity: Entity,
    old_service: Service,
    service: Service,
  ) => {
    setOpenDialog(false);
    handleUpdate(entity, old_service, service);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenServicesDialog = async (): Promise<void> => {
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name,
  });

  return (
    <>
      {openDialog && (
        <ServicesDialog
          open={openDialog}
          entity={entity}
          handleClose={handleCloseDialog}
          handleImport={handleCloseImport}
          handleUpdate={handleCloseUpdate}
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
        onClose={handleCloseMenu}
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
              Import service in Rootly
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
              onClick={() => handleDelete(entity.linkedService)}
            >
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                Unlink
              </Typography>
            </MenuItem>
            <MenuItem key="details" onClick={handleCloseMenu}>
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
      </Menu>
    </>
  );
};
