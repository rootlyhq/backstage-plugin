import { parseEntityRef } from '@backstage/catalog-model';
import { Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import { makeStyles, Tooltip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-use';

import {
  RootlyFunctionality,
  RootlyFunctionalitiesFetchOpts,
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

export const FunctionalitiesTable = ({ params }: { params?: RootlyFunctionalitiesFetchOpts }) => {
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
    async () => await RootlyApi.getFunctionalities({ ...params, page: page }),
    [page],
  );

  const nameColumn = useCallback((rowData: RootlyFunctionality) => {
    return (
      <Tooltip
        title={
          rowData.attributes.description?.substring(0, 255) ||
          rowData.attributes.name
        }
      >
        <Link target="blank" href={RootlyApi.getFunctionalityDetailsURL(rowData)}>
          {rowData.attributes.name}
        </Link>
      </Tooltip>
    );
  }, []);

  const backstageColumn = useCallback((rowData: RootlyFunctionality) => {
    if (rowData.attributes.backstage_id) {
      return (
        <EntityRefLink
          entityRef={parseEntityRef(rowData.attributes.backstage_id)}
        />
      );
    } 
      return <div>N/A</div>;
    
  }, []);

  const columns: TableColumn<RootlyFunctionality>[] = [
    {
      title: 'Name',
      field: 'name',
      highlight: true,
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: nameColumn,
    },
    {
      title: 'Backstage',
      field: 'backstage',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
      render: backstageColumn,
    },
    {
      title: 'Incidents',
      field: 'attributes.incidents_count',
      type: 'numeric',
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle,
    },
    {
      title: 'Updated At',
      field: 'attributes.updated_at',
      type: 'datetime',
      dateSetting: { locale: 'en-US' },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle,
    },
    {
      title: 'Created At',
      field: 'attributes.created_at',
      type: 'datetime',
      dateSetting: { locale: 'en-US' },
      cellStyle: mediumColumnStyle,
      headerStyle: mediumColumnStyle,
    },
  ];

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const data = response ? response.data : [];

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
      emptyContent={<div className={classes.empty}>No functionalities</div>}
      onPageChange={pageIndex => setPage({ ...page, number: pageIndex + 1 })}
      onRowsPerPageChange={rowsPerPage =>
        setPage({ ...page, size: rowsPerPage })
      }
    />
  );
};
