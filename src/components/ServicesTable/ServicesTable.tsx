import { parseEntityRef } from '@backstage/catalog-model';
import { Table, TableColumn } from '@backstage/core-components';
import {
  configApiRef,
  discoveryApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import { makeStyles, Tooltip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-use';

import {
  RootlyServicesFetchOpts,
  RootlyService,
  RootlyApi,
} from '@rootly/backstage-plugin-common';
import { useRootlyClient } from '../../api';

import { SearchBarBase } from '@backstage/plugin-search-react'; // Updated import

const useStyles = makeStyles(theme => ({
  container: {
    width: 850,
  },
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
}));

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export const ServicesTable = ({
  organizationId,
  params,
}: {
  organizationId?: string;
  params?: RootlyServicesFetchOpts;
}) => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const identifyApi = useApi(identityApiRef);
  const rootlyClient = useRootlyClient({
    discovery: discoveryApi,
    identify: identifyApi,
    config: configApi,
    organizationId: organizationId,
  });

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

  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const {
    value: response,
    loading,
    error,
  } = useAsync(
    async () =>
      await rootlyClient.getServices({
        ...params,
        page: page,
        filter: { search: searchTerm },
      }),
    [organizationId, page, searchTerm],
  );

  const nameColumn = useCallback((rowData: RootlyService) => {
    return (
      <Tooltip
        title={
          rowData.attributes.description?.substring(0, 255) ||
          rowData.attributes.name
        }
      >
        <Link target="blank" href={RootlyApi.getServiceDetailsURL(rowData)}>
          {rowData.attributes.name}
        </Link>
      </Tooltip>
    );
  }, []);

  const backstageColumn = useCallback((rowData: RootlyService) => {
    if (rowData.attributes.backstage_id) {
      return (
        <EntityRefLink
          entityRef={parseEntityRef(rowData.attributes.backstage_id)}
        />
      );
    }
    return <div>N/A</div>;
  }, []);

  const columns: TableColumn<RootlyService>[] = [
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
    <>
      <div className={classes.searchContainer}>
        {/* Backstage SearchBar */}
        <SearchBarBase
          onChange={setSearchTerm} // Directly pass the search term to setSearchTerm
          placeholder="Search Services"
          value={searchTerm}
        />
      </div>
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
        emptyContent={<div className={classes.empty}>No services</div>}
        onPageChange={pageIndex => setPage({ ...page, number: pageIndex + 1 })}
        onRowsPerPageChange={rowsPerPage =>
          setPage({ ...page, size: rowsPerPage })
        }
      />
    </>
  );
};
