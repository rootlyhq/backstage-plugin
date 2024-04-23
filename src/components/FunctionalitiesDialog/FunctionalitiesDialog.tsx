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
import { Entity, Functionality } from '../../types';

export const FunctionalitiesDialog = ({
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
      await RootlyApi.getFunctionalities({
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

  const onSelectedFunctionalityChanged = (newSelectedItem: SelectedItems) => {
    setSelectedItem(newSelectedItem);
  };

  const onImportAsNewFunctionalityButtonClicked = () => {
    handleImport(entity);
  };

  const onLinkToExistingFunctionalityButtonClicked = () => {
    handleUpdate(
      entity,
      { id: selectedItem } as Functionality,
      { id: entity.linkedFunctionality?.id } as Functionality,
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
      <DialogTitle id="dialog-title">Functionalities</DialogTitle>
      <DialogContent>
        {entity && !entity.linkedFunctionality && (
          <>
            <Box sx={{ mx: 'auto' }} mb={2}>
              <Button
                color="primary"
                variant="contained"
                onClick={onImportAsNewFunctionalityButtonClicked}
              >
                Import as new Functionality
              </Button>
            </Box>
            <Divider />
          </>
        )}
        <Box sx={{ mx: 'auto' }} mt={2}>
          <Typography>
            Select a Rootly Functionality you want to map this component to:
          </Typography>
          <Select
            onChange={onSelectedFunctionalityChanged}
            selected={selectedItem}
            placeholder="Select"
            label="Functionalities"
            items={(data || []).map((functionality: Functionality): SelectItem => {
              return {
                label: functionality.attributes.name,
                value: functionality.id,
              };
            })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onLinkToExistingFunctionalityButtonClicked}>
          Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};
