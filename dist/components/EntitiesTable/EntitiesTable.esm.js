import { stringifyEntityRef } from '@backstage/catalog-model';
import { Table, Progress } from '@backstage/core-components';
import { useApi, configApiRef, discoveryApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useAsync } from 'react-use';
import { ROOTLY_ANNOTATION_ORG_ID, RootlyApi } from '@rootly/backstage-plugin-common';
import { useRootlyClient } from '../../api.esm.js';

const EntitiesTable = () => {
  const catalogApi = useApi(catalogApiRef);
  const configApi = useApi(configApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const identifyApi = useApi(identityApiRef);
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const { value, loading, error } = useAsync(
    async () => await catalogApi.getEntities()
  );
  const fetchService = (entity) => {
    const rootlyClient = useRootlyClient({ discovery: discoveryApi, identify: identifyApi, config: configApi, organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID] });
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
      async () => await rootlyClient.getServices({
        filter: {
          backstage_id: entityTriplet
        }
      }),
      []
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
  const fetchFunctionality = (entity) => {
    const rootlyClient = useRootlyClient({ discovery: discoveryApi, identify: identifyApi, config: configApi, organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID] });
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
      async () => await rootlyClient.getFunctionalities({
        filter: {
          backstage_id: entityTriplet
        }
      }),
      []
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
  const fetchTeam = (entity) => {
    const rootlyClient = useRootlyClient({ discovery: discoveryApi, identify: identifyApi, config: configApi, organizationId: entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID] });
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
      async () => await rootlyClient.getTeams({
        filter: {
          backstage_id: entityTriplet
        }
      }),
      []
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
        return fetchService(rowData);
      }
    },
    {
      title: "Rootly Functionality",
      field: "linked",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        return fetchFunctionality(rowData);
      }
    },
    {
      title: "Rootly Team",
      field: "linked",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => {
        return fetchTeam(rowData);
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

export { EntitiesTable };
//# sourceMappingURL=EntitiesTable.esm.js.map
