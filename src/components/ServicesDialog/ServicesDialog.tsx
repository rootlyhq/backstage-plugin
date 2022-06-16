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
import { Entity, Service } from '../../types';

export const ServicesDialog = ({
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
      await RootlyApi.getServices({
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
        s => s.attributes.backstage_id == entityTriplet,
      )?.id;
      if (selectedItem) {
        setSelectedItem(selectedItem);
      }
    }
  }, [data]);

  const onSelectedServiceChanged = (newSelectedItem: SelectedItems) => {
    setSelectedItem(newSelectedItem);
  };

  const onImportAsNewServiceButtonClicked = () => {
    handleImport(entity);
  };

  const onLinkToExistingServiceButtonClicked = () => {
    handleUpdate(
      entity,
      { id: entity.linkedService?.id } as Service,
      { id: selectedItem } as Service,
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
      <DialogTitle id="dialog-title">Services</DialogTitle>
      <DialogContent>
        {entity && !entity.linkedService && (
          <>
            <Box sx={{ mx: 'auto' }} mb={2}>
              <Button
                color="primary"
                variant="contained"
                onClick={onImportAsNewServiceButtonClicked}
              >
                Import as new service
              </Button>
            </Box>
            <Divider />
          </>
        )}
        <Box sx={{ mx: 'auto' }} mt={2}>
          <Typography>
            Select a Rootly service you want to map this component to:
          </Typography>
          <Select
            onChange={onSelectedServiceChanged}
            selected={selectedItem}
            placeholder="Select"
            label="Services"
            items={(data || []).map((service: Service): SelectItem => {
              return {
                label: service.attributes.name,
                value: service.id,
              };
            })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onLinkToExistingServiceButtonClicked}>
          Link
        </Button>
      </DialogActions>
    </Dialog>
  );
};
