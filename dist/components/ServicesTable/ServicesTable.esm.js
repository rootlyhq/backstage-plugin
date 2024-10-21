import { parseEntityRef } from '@backstage/catalog-model';
import { Table } from '@backstage/core-components';
import { useApi, configApiRef, discoveryApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import { makeStyles, Tooltip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useState, useCallback } from 'react';
import { useAsync } from 'react-use';
import { RootlyApi } from '@rootly/backstage-plugin-common';
import { useRootlyClient } from '../../api.esm.js';
import { SearchBarBase } from '@backstage/plugin-search-react';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 850
  },
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  },
  searchContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(2)
  }
}));
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const ServicesTable = ({
  organizationId,
  params
}) => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const identifyApi = useApi(identityApiRef);
  const rootlyClient = useRootlyClient({
    discovery: discoveryApi,
    identify: identifyApi,
    config: configApi,
    organizationId
  });
  const smallColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const mediumColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER,
    size: DEFAULT_PAGE_SIZE
  });
  const [searchTerm, setSearchTerm] = useState("");
  const {
    value: response,
    loading,
    error
  } = useAsync(
    async () => await rootlyClient.getServices({
      ...params,
      page,
      filter: { search: searchTerm, ...params?.filter }
    }),
    [organizationId, page, searchTerm]
  );
  const nameColumn = useCallback((rowData) => {
    return /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: rowData.attributes.description?.substring(0, 255) || rowData.attributes.name
      },
      /* @__PURE__ */ React.createElement(Link, { target: "blank", href: RootlyApi.getServiceDetailsURL(rowData) }, rowData.attributes.name)
    );
  }, []);
  const backstageColumn = useCallback((rowData) => {
    if (rowData.attributes.backstage_id) {
      return /* @__PURE__ */ React.createElement(
        EntityRefLink,
        {
          entityRef: parseEntityRef(rowData.attributes.backstage_id)
        }
      );
    }
    return /* @__PURE__ */ React.createElement("div", null, "N/A");
  }, []);
  const columns = [
    {
      title: "Name",
      field: "name",
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: nameColumn
    },
    {
      title: "Backstage",
      field: "backstage",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: backstageColumn
    },
    {
      title: "Incidents",
      field: "attributes.incidents_count",
      type: "numeric",
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Updated At",
      field: "attributes.updated_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Created At",
      field: "attributes.created_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = response ? response.data : [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: classes.searchContainer }, /* @__PURE__ */ React.createElement(
    SearchBarBase,
    {
      onChange: setSearchTerm,
      placeholder: "Search Services",
      value: searchTerm
    }
  )), /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: false,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: DEFAULT_PAGE_SIZE,
        padding: "dense"
      },
      localization: { header: { actions: void 0 } },
      columns,
      data,
      page: page.number - 1,
      totalCount: response?.meta.total_count,
      emptyContent: /* @__PURE__ */ React.createElement("div", { className: classes.empty }, "No services"),
      onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
      onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
    }
  ));
};

export { ServicesTable };
//# sourceMappingURL=ServicesTable.esm.js.map
