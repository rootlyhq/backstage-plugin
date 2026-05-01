import { parseEntityRef } from '@backstage/catalog-model';
import { Table, TableColumn } from '@backstage/core-components';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Tooltip,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-use';

import {
  RootlyCatalogEntitiesFetchOpts,
  RootlyCatalogEntity,
} from '@rootly/backstage-plugin-common';
import { useRootlyClient } from '../../api';

import { SearchBarBase } from '@backstage/plugin-search-react';

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
    gap: theme.spacing(2),
    alignItems: 'center',
  },
}));

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export const CatalogEntitiesTable = ({
  organizationId,
  params,
}: {
  organizationId?: string;
  params?: RootlyCatalogEntitiesFetchOpts;
}) => {
  const classes = useStyles();
  const rootlyClient = useRootlyClient({ organizationId });

  const smallColumnStyle = {
    width: '5%',
    maxWidth: '5%',
  };
  const mediumColumnStyle = {
    width: '10%',
    maxWidth: '10%',
  };

  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [page, setPage] = useState({
    number: DEFAULT_PAGE_NUMBER,
    size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const {
    value: catalogsResponse,
    loading: catalogsLoading,
    error: catalogsError,
  } = useAsync(async () => await rootlyClient.getCatalogs(), [organizationId]);

  const catalogs = catalogsResponse?.data || [];
  const activeCatalogId = selectedCatalogId || catalogs[0]?.id || '';
  const activeCatalogSlug = catalogs.find((c: any) => c.id === activeCatalogId)?.attributes?.slug || '';

  const {
    value: response,
    loading,
    error,
  } = useAsync(
    async () =>
      activeCatalogId
        ? await rootlyClient.getCatalogEntities(activeCatalogId, {
            ...params,
            page: page,
            filter: { search: searchTerm, ...params?.filter },
          })
        : undefined,
    [organizationId, activeCatalogId, page, searchTerm],
  );

  const nameColumn = useCallback((rowData: RootlyCatalogEntity) => {
    return (
      <Tooltip
        title={
          rowData.attributes.description?.substring(0, 255) ||
          rowData.attributes.name
        }
      >
        <Link
          target="blank"
          href={rootlyClient.getCatalogEntityDetailsURL(rowData, activeCatalogSlug)}
        >
          {rowData.attributes.name}
        </Link>
      </Tooltip>
    );
  }, [activeCatalogSlug]);

  const backstageColumn = useCallback((rowData: RootlyCatalogEntity) => {
    if (rowData.attributes.backstage_id) {
      try {
        const entityRef = parseEntityRef(rowData.attributes.backstage_id);
        return <EntityRefLink entityRef={parseEntityRef(entityRef)} />;
      } catch (e) {
        return <div>N/A</div>;
      }
    }
    return <div>N/A</div>;
  }, []);

  const columns: TableColumn<RootlyCatalogEntity>[] = [
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
      title: 'Description',
      field: 'attributes.description',
      cellStyle: smallColumnStyle,
      headerStyle: smallColumnStyle,
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

  if (catalogsError) {
    return <Alert severity="error">{catalogsError.message}</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const data = response ? response.data : [];

  return (
    <>
      <div className={classes.searchContainer}>
        {!catalogsLoading && catalogs.length > 0 && (
          <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
            <InputLabel>Catalog</InputLabel>
            <Select
              value={activeCatalogId}
              onChange={e => {
                setSelectedCatalogId(e.target.value as string);
                setPage({ number: DEFAULT_PAGE_NUMBER, size: page.size });
              }}
              label="Catalog"
            >
              {catalogs.map((catalog: any) => (
                <MenuItem key={catalog.id} value={catalog.id}>
                  {catalog.attributes.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <SearchBarBase
          onChange={setSearchTerm}
          placeholder="Search Catalog Entities"
          value={searchTerm}
        />
      </div>
      <Table
        isLoading={loading || catalogsLoading}
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
        emptyContent={
          <div className={classes.empty}>No catalog entities</div>
        }
        onPageChange={pageIndex => setPage({ ...page, number: pageIndex + 1 })}
        onRowsPerPageChange={rowsPerPage =>
          setPage({ ...page, size: rowsPerPage })
        }
      />
    </>
  );
};
