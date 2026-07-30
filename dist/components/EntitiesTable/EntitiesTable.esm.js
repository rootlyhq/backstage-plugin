import { stringifyEntityRef } from '@backstage/catalog-model';
import { Table, Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useAsync } from 'react-use';
import { ROOTLY_ANNOTATION_ORG_ID, ROOTLY_ANNOTATION_CATALOG_ENTITY_ID, ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG } from '@rootly/backstage-plugin-common';
import { useRootlyClient } from '../../api.esm.js';

const getEntityTriplet = (entity) => stringifyEntityRef({
  namespace: entity.metadata.namespace,
  kind: entity.kind,
  name: entity.metadata.name
});
const ServiceLinkCell = ({ entity }) => {
  const rootlyClient = useRootlyClient({
    organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
  });
  const entityTriplet = getEntityTriplet(entity);
  const {
    value: response,
    loading,
    error
  } = useAsync(() => rootlyClient.getServices({ filter: { backstage_id: entityTriplet } }), [entityTriplet, rootlyClient]);
  if (loading) return /* @__PURE__ */ React.createElement(Progress, null);
  if (error) return /* @__PURE__ */ React.createElement("div", null, "Error");
  const service = response?.data[0];
  return service ? /* @__PURE__ */ React.createElement(Link, { target: "blank", href: rootlyClient.getServiceDetailsURL(service) }, service.attributes.name) : /* @__PURE__ */ React.createElement("div", null, "Not Linked");
};
const FunctionalityLinkCell = ({ entity }) => {
  const rootlyClient = useRootlyClient({
    organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
  });
  const entityTriplet = getEntityTriplet(entity);
  const {
    value: response,
    loading,
    error
  } = useAsync(
    () => rootlyClient.getFunctionalities({
      filter: { backstage_id: entityTriplet }
    }),
    [entityTriplet, rootlyClient]
  );
  if (loading) return /* @__PURE__ */ React.createElement(Progress, null);
  if (error) return /* @__PURE__ */ React.createElement("div", null, "Error");
  const functionality = response?.data[0];
  return functionality ? /* @__PURE__ */ React.createElement(Link, { target: "blank", href: rootlyClient.getFunctionalityDetailsURL(functionality) }, functionality.attributes.name) : /* @__PURE__ */ React.createElement("div", null, "Not Linked");
};
const TeamLinkCell = ({ entity }) => {
  const rootlyClient = useRootlyClient({
    organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
  });
  const entityTriplet = getEntityTriplet(entity);
  const {
    value: response,
    loading,
    error
  } = useAsync(() => rootlyClient.getTeams({ filter: { backstage_id: entityTriplet } }), [entityTriplet, rootlyClient]);
  if (loading) return /* @__PURE__ */ React.createElement(Progress, null);
  if (error) return /* @__PURE__ */ React.createElement("div", null, "Error");
  const team = response?.data[0];
  return team ? /* @__PURE__ */ React.createElement(Link, { target: "blank", href: rootlyClient.getTeamDetailsURL(team) }, team.attributes.name) : /* @__PURE__ */ React.createElement("div", null, "Not Linked");
};
const CatalogEntityLinkCell = ({ entity }) => {
  const rootlyClient = useRootlyClient({
    organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID]
  });
  const catalogEntityAnnotation = entity.metadata.annotations?.[ROOTLY_ANNOTATION_CATALOG_ENTITY_ID] || entity.metadata.annotations?.[ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG];
  const {
    value: response,
    loading,
    error
  } = useAsync(
    () => catalogEntityAnnotation ? rootlyClient.getCatalogEntity(catalogEntityAnnotation, {
      include: "catalog"
    }) : Promise.resolve(void 0),
    [catalogEntityAnnotation, rootlyClient]
  );
  if (!catalogEntityAnnotation) return /* @__PURE__ */ React.createElement("div", null, "-");
  if (loading) return /* @__PURE__ */ React.createElement(Progress, null);
  if (error) return /* @__PURE__ */ React.createElement("div", null, "Error");
  const catalogEntity = response?.data;
  const catalogSlug = response?.included?.find((included) => included.type === "catalogs")?.attributes?.slug;
  return catalogEntity ? /* @__PURE__ */ React.createElement(Link, { target: "blank", href: rootlyClient.getCatalogEntityDetailsURL(catalogEntity, catalogSlug) }, catalogEntity.attributes.name) : /* @__PURE__ */ React.createElement("div", null, "Not Linked");
};
const EntitiesTable = () => {
  const catalogApi = useApi(catalogApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const { value, loading, error } = useAsync(() => catalogApi.getEntities(), [catalogApi]);
  const columns = [
    {
      title: "Kind",
      field: "kind",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle
    },
    {
      title: "Name",
      field: "metadata.name",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(EntityRefLink, { entityRef: rowData })
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
      render: (rowData) => /* @__PURE__ */ React.createElement(ServiceLinkCell, { entity: rowData })
    },
    {
      title: "Rootly Functionality",
      field: "linked",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(FunctionalityLinkCell, { entity: rowData })
    },
    {
      title: "Rootly Team",
      field: "linked",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(TeamLinkCell, { entity: rowData })
    },
    {
      title: "Rootly Catalog Entity",
      field: "linked",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(CatalogEntityLinkCell, { entity: rowData })
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = value ? value.items.map((entity) => ({
    ...entity,
    id: getEntityTriplet(entity),
    rootlyKind: void 0,
    linkedService: void 0,
    linkedFunctionality: void 0,
    linkedTeam: void 0,
    linkedCatalogEntity: void 0
  })) : [];
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

export { EntitiesTable };
//# sourceMappingURL=EntitiesTable.esm.js.map
