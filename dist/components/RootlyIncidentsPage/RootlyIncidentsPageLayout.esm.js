import { stringifyEntityRef } from '@backstage/catalog-model';
import { Progress, Page, Content, ContentHeader } from '@backstage/core-components';
import { attachComponentData, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid, Box, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { IncidentsTable } from '../IncidentsTable/IncidentsTable.esm.js';
import { ServicesDialog } from '../ServicesDialog/ServicesDialog.esm.js';
import { RootlyApiRef } from '../../api.esm.js';

const Route = () => null;
attachComponentData(Route, "core.gatherMountPoints", true);
const RootlyIncidentsPageLayout = () => {
  const { entity } = useEntity();
  const RootlyApi = useApi(RootlyApiRef);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleCloseImport = async (entity2) => {
    await RootlyApi.importServiceEntity(entity2);
    setReload(!reload);
  };
  const handleCloseUpdate = async (entity2, service2, old_service) => {
    await RootlyApi.updateServiceEntity(entity2, service2, old_service);
    setReload(!reload);
  };
  const entityTriplet = stringifyEntityRef({
    namespace: entity.metadata.namespace,
    kind: entity.kind,
    name: entity.metadata.name
  });
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await RootlyApi.getServices({
      filter: {
        backstage_id: entityTriplet
      }
    }),
    [reload]
  );
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const service = response && response.data && response.data.length > 0 ? response.data[0] : null;
  if (!service) {
    return /* @__PURE__ */ React.createElement(Page, { themeId: "tool" }, /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, { title: entity.metadata.name }), /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 3, direction: "column" }, /* @__PURE__ */ React.createElement(Box, { sx: { mx: "auto" }, mt: 2 }, /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, "Looks like this component is not linked to any services in Rootly")), /* @__PURE__ */ React.createElement(Box, { sx: { mx: "auto" }, mt: 2 }, /* @__PURE__ */ React.createElement(
      Button,
      {
        color: "primary",
        variant: "contained",
        onClick: handleOpenDialog
      },
      "Import or link to an existing Rootly service"
    )), /* @__PURE__ */ React.createElement(
      ServicesDialog,
      {
        open,
        entity,
        handleClose: handleCloseDialog,
        handleImport: handleCloseImport,
        handleUpdate: handleCloseUpdate
      }
    ))));
  }
  return /* @__PURE__ */ React.createElement(Page, { themeId: "tool" }, /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, { title: "Ongoing incidents" }), /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 3, direction: "column" }, /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(
    IncidentsTable,
    {
      params: {
        filter: {
          services: service.attributes.slug,
          status: "started,mitigated"
        },
        include: "environments,services,functionalities,groups,incident_types"
      }
    }
  ))), /* @__PURE__ */ React.createElement(ContentHeader, { title: "Past incidents" }), /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 3, direction: "column" }, /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(
    IncidentsTable,
    {
      params: {
        filter: {
          services: service.attributes.slug
        },
        include: "environments,services,functionalities,groups,incident_types"
      }
    }
  )))));
};
RootlyIncidentsPageLayout.Route = Route;

export { RootlyIncidentsPageLayout };
//# sourceMappingURL=RootlyIncidentsPageLayout.esm.js.map
