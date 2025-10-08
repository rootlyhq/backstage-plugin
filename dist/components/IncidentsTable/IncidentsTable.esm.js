import { Table } from '@backstage/core-components';
import { makeStyles, Tooltip, Chip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { IncidentWrapper } from '../Incident/index.esm.js';
import { ColoredChip } from '../UI/ColoredChip.esm.js';
import { ColoredChips } from '../UI/ColoredChips.esm.js';
import { StatusChip } from '../UI/StatusChip.esm.js';
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
const IncidentsTable = ({
  organizationId,
  params
}) => {
  const classes = useStyles();
  const rootlyClient = useRootlyClient({ organizationId });
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
    async () => await rootlyClient.getIncidents({
      ...params,
      page,
      filter: { search: searchTerm, ...params?.filter }
    }),
    // Pass search term to API
    [organizationId, page, searchTerm]
  );
  const columns = [
    {
      title: "Started At",
      field: "incident.attributes.started_at",
      type: "datetime",
      dateSetting: { locale: "en-US" },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle
    },
    {
      title: "Title",
      field: "title",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(
        Tooltip,
        {
          title: rowData.incident.attributes.summary?.substring(0, 255) || rowData.incident.attributes.title
        },
        /* @__PURE__ */ React.createElement(Link, { target: "_blank", href: rowData.incident.attributes.url }, rowData.incident.attributes.title)
      )
    },
    {
      title: "Started By",
      field: "user.full_name",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(
        Chip,
        {
          label: rowData.incident.attributes.user?.data.attributes.full_name,
          size: "small"
        }
      )
    },
    {
      title: "Status",
      field: "status",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(StatusChip, { status: rowData.incident.attributes.status })
    },
    {
      title: "Severity",
      field: "severity",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(
        ColoredChip,
        {
          label: rowData.incident.attributes.severity?.data.attributes.name,
          tooltip: rowData.incident.attributes.severity?.data.attributes.description,
          color: rowData.incident.attributes.severity?.data.attributes.color
        }
      )
    },
    {
      title: "Environments",
      field: "environments",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, { objects: rowData.environments() })
    },
    {
      title: "Services",
      field: "services",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, { objects: rowData.services() })
    },
    {
      title: "Functionalities",
      field: "functionalities",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, { objects: rowData.functionalities() })
    },
    {
      title: "Teams",
      field: "teams",
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: (rowData) => /* @__PURE__ */ React.createElement(ColoredChips, { objects: rowData.groups() })
    }
  ];
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, { severity: "error" }, error.message);
  }
  const data = response ? response.data.map((i) => {
    return new IncidentWrapper(i, response.included);
  }) : [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: classes.searchContainer }, /* @__PURE__ */ React.createElement(
    SearchBarBase,
    {
      onChange: setSearchTerm,
      placeholder: "Search Incidents",
      value: searchTerm
    }
  )), /* @__PURE__ */ React.createElement(
    Table,
    {
      isLoading: loading,
      options: {
        sorting: true,
        search: false,
        // Disabling built-in search as we are doing a custom search
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
      emptyContent: /* @__PURE__ */ React.createElement("div", { className: classes.empty }, "No incidents"),
      onPageChange: (pageIndex) => setPage({ ...page, number: pageIndex + 1 }),
      onRowsPerPageChange: (rowsPerPage) => setPage({ ...page, size: rowsPerPage })
    }
  ));
};

export { IncidentsTable };
//# sourceMappingURL=IncidentsTable.esm.js.map
