import { stringifyEntityRef } from '@backstage/catalog-model';
import { Select, SelectedItems, SelectItem } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { RootlyApiRef } from '../../api';
import { Entity, Team } from '../../types';

export const TeamsDialog = ({
  open,
  entity,
  handleClose,
  handleImport,
  handleUpdate,
}: {
  open: boolean;
  entity: Entity;
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  handleImport: Function;
  handleUpdate: Function;
}) => {
  const RootlyApi = useApi(RootlyApiRef);
  const [selectedItem, setSelectedItem] = useState('' as SelectedItems);

  const {
    value: response,
    loading,
    error,
  } = useAsync(
    async () =>
      await RootlyApi.getTeams({
        filter: {
          backstage_id: null,
        },
        page: { size: 999 },
      }),
  );

  const data = response ? response.data : [];

  useEffect(() => {
    if (entity && data) {
      const entityTriplet = stringifyEntityRef({
        namespace: entity.metadata.namespace,
        kind: entity.kind,
        name: entity.metadata.name,
      });
      const selectedItem = data.find(
        s => s.attributes.backstage_id === entityTriplet,
      )?.id;
      if (selectedItem) {
        setSelectedItem(selectedItem);
      }
    }
  }, [data]);

  const onSelectedTeamChanged = (newSelectedItem: SelectedItems) => {
    setSelectedItem(newSelectedItem);
  };

  const onImportAsNewTeamButtonClicked = () => {
    handleImport(entity);
  };

  const onLinkToExistingTeamButtonClicked = () => {
    handleUpdate(
      entity,
      { id: selectedItem } as Team,
      { id: entity.linkedTeam?.id } as Team,
    );
  };

  if (loading) {
    return <></>;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Teams</DialogTitle>
      <DialogContent>
        {entity && !entity.linkedTeam && (
          <>
            <Box sx={{ mx: 'auto' }} mb={2}>
              <Button
                color="primary"
                variant="contained"
                onClick={onImportAsNewTeamButtonClicked}
              >
                Import as new Team
              </Button>
            </Box>
            <Divider />
          </>
        )}
        <Box sx={{ mx: 'auto' }} mt={2}>
          <Typography>
            Select a Rootly Team you want to map this component to:
          </Typography>
          <Select
            onChange={onSelectedTeamChanged}
            selected={selectedItem}
            placeholder="Select"
            label="Teams"
            items={(data || []).map((team: Team): SelectItem => {
              return {
                label: team.attributes.name,
                value: team.id,
              };
            })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onLinkToExistingTeamButtonClicked}>
          Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};
