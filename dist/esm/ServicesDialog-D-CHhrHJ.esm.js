import { stringifyEntityRef } from '@backstage/catalog-model';
import { Select } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Dialog, DialogTitle, DialogContent, Box, Button, Typography, DialogActions } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { Alert } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { useAsync } from 'react-use';
import { R as RootlyApiRef } from './index-BWCj2b_g.esm.js';

const ServicesDialog = ({
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
    async () => await RootlyApi.getServices({
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
        setSelectedItem(selectedItem);
      }
    }
  }, [data]);
  const onSelectedServiceChanged = (newSelectedItem) => {
    setSelectedItem(newSelectedItem);
  };
  const onImportAsNewServiceButtonClicked = () => {
    handleImport(entity);
  };
  const onLinkToExistingServiceButtonClicked = () => {
    var _a;
    handleUpdate(
      entity,
      { id: selectedItem },
      { id: (_a = entity.linkedService) == null ? void 0 : _a.id }
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
    /* @__PURE__ */ React.createElement(DialogTitle, { id: "dialog-title" }, "Services"),
    /* @__PURE__ */ React.createElement(DialogContent, null, entity && !entity.linkedService && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, { sx: { mx: "auto" }, mb: 2 }, /* @__PURE__ */ React.createElement(
      Button,
      {
        color: "primary",
        variant: "contained",
        onClick: onImportAsNewServiceButtonClicked
      },
      "Import as new service"
    )), /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(Box, { sx: { mx: "auto" }, mt: 2 }, /* @__PURE__ */ React.createElement(Typography, null, "Select a Rootly service you want to map this component to:"), /* @__PURE__ */ React.createElement(
      Select,
      {
        onChange: onSelectedServiceChanged,
        selected: selectedItem,
        placeholder: "Select",
        label: "Services",
        items: (data || []).map((service) => {
          return {
            label: service.attributes.name,
            value: service.id
          };
        })
      }
    ))),
    /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, { color: "primary", onClick: onLinkToExistingServiceButtonClicked }, "Link"))
  );
};

export { ServicesDialog as S };
//# sourceMappingURL=ServicesDialog-D-CHhrHJ.esm.js.map
