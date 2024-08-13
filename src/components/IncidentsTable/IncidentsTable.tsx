import { Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Chip, makeStyles, Tooltip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { IncidentWrapper } from '../Incident';
import { ColoredChip } from '../UI/ColoredChip';
import { ColoredChips } from '../UI/ColoredChips';
import { StatusChip } from '../UI/StatusChip';

import {
  RootlyIncident,
  RootlyIncidentsFetchOpts,
} from '@rootly/backstage-plugin-common';
import { RootlyApiRef } from '../../api';

const useStyles = makeStyles(theme => ({
  container: {
    width: 850,
  },
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export const IncidentsTable = ({ params }: { params?: RootlyIncidentsFetchOpts }) => {
  const classes = useStyles();
  const RootlyApi = useApi(RootlyApiRef);

  const smallColumnStyle = {
    width: '5%',
    maxWidth: '5%',
  };
  const mediumColumnStyle = {
    width: '10%',
    maxWidth: '10%',
  };

  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER,
    size: DEFAULT_PAGE_SIZE,
  });

  const {
    value: response,
    loading,
    error,
  } = useAsync(
    async () => await RootlyApi.getIncidents({ ...params, page: page }),
    [page],
  );

  const columns: TableColumn<IncidentWrapper>[] = [
    {
      title: 'Started At',
      field: 'incident.attributes.started_at',
      type: 'datetime',
      dateSetting: { locale: 'en-US' },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle,
    },
    {
      title: 'Title',
      field: 'title',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => (
        <Tooltip
          title={
            rowData.incident.attributes.summary?.substring(0, 255) ||
            rowData.incident.attributes.title
          }
        >
          <Link
            target="blank"
            href={rowData.incident.attributes.url}
          >
            {rowData.incident.attributes.title}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: 'Started By',
      field: 'user.full_name',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => (
        <Chip
          label={rowData.incident.attributes.user?.data.attributes.full_name}
          size="small"
        />
      ),
    },
    {
      title: 'Status',
      field: 'status',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => (
        <StatusChip status={rowData.incident.attributes.status} />
      ),
    },
    {
      title: 'Severity',
      field: 'severity',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => (
        <ColoredChip
          label={rowData.incident.attributes.severity?.data.attributes.name}
          tooltip={
            rowData.incident.attributes.severity?.data.attributes.description
          }
          color={rowData.incident.attributes.severity?.data.attributes.color}
        />
      ),
    },
    {
      title: 'Environments',
      field: 'environments',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <ColoredChips objects={rowData.environments()} />,
    },
    {
      title: 'Services',
      field: 'services',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <ColoredChips objects={rowData.services()} />,
    },
    {
      title: 'Functionalities',
      field: 'functionalities',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <ColoredChips objects={rowData.functionalities()} />,
    },
    {
      title: 'Teams',
      field: 'teams',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: rowData => <ColoredChips objects={rowData.groups()} />,
    },
  ];

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const data = response
    ? response.data.map((i: RootlyIncident) => {
        return new IncidentWrapper(i, response.included);
      })
    : [];

  return (
    <Table
      isLoading={loading}
      options={{
        sorting: true,
        search: false,
        paging: true,
        actionsColumnIndex: -1,
        pageSize: DEFAULT_PAGE_SIZE,
        padding: 'dense',
      }}
      localization={{ header: { actions: undefined } }}
      columns={columns}
      data={data}
      page={page.number - 1}
      totalCount={response?.meta.total_count}
      emptyContent={<div className={classes.empty}>No incidents</div>}
      onPageChange={pageIndex => setPage({ ...page, number: pageIndex + 1 })}
      onRowsPerPageChange={rowsPerPage =>
        setPage({ ...page, size: rowsPerPage })
      }
    />
  );
};
