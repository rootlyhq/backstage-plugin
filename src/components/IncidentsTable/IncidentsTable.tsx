import { Table, TableColumn, TableProps } from '@backstage/core-components';
import { Chip, makeStyles, Tooltip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { IncidentWrapper } from '../Incident';
import { ColoredChip } from '../UI/ColoredChip';
import { ColoredChips } from '../UI/ColoredChips';
import { StatusChip } from '../UI/StatusChip';

import {
  RootlyIncident,
  RootlyIncidentsFetchOpts,
} from '@rootly/backstage-plugin-common';
import { useRootlyClient, useRootlyInstanceSettings } from '../../api';

import { SearchBarBase } from '@backstage/plugin-search-react';
import { IncidentsFilters } from './IncidentsFilters';
import {
  availableIncidentFilters,
  buildIncidentsQuery,
  EMPTY_INCIDENT_FILTERS,
  IncidentFilters,
  SORTABLE_INCIDENT_FIELDS,
} from './incidentsQuery';

const useStyles = makeStyles(theme => ({
  container: {
    width: 850,
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
}));

type RemoteData = Extract<
  TableProps<IncidentWrapper>['data'],
  (...args: any[]) => unknown
>;
type Query = Parameters<RemoteData>[0];

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

const smallColumnStyle = {
  width: '5%',
  maxWidth: '5%',
};
const mediumColumnStyle = {
  width: '10%',
  maxWidth: '10%',
};

// Only columns the Rootly API can sort on are sortable, so the order always
// spans every page. Defined once so Material Table keeps its sort state.
const BASE_COLUMNS: TableColumn<IncidentWrapper>[] = [
  {
    title: 'Started At',
    field: 'incident.attributes.started_at',
    type: 'datetime',
    dateSetting: { locale: 'en-US' },
    defaultSort: 'desc',
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
        <Link target="_blank" href={rowData.incident.attributes.url}>
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
  {
    title: 'Mitigated At',
    field: 'incident.attributes.mitigated_at',
    type: 'datetime',
    dateSetting: { locale: 'en-US' },
    emptyValue: '-',
    cellStyle: mediumColumnStyle,
    headerStyle: mediumColumnStyle,
  },
  {
    title: 'Resolved At',
    field: 'incident.attributes.resolved_at',
    type: 'datetime',
    dateSetting: { locale: 'en-US' },
    emptyValue: '-',
    cellStyle: mediumColumnStyle,
    headerStyle: mediumColumnStyle,
  },
];

const INCIDENT_COLUMNS: TableColumn<IncidentWrapper>[] = BASE_COLUMNS.map(
  column => ({
    ...column,
    sorting: Boolean(
      column.field && SORTABLE_INCIDENT_FIELDS[column.field as string],
    ),
  }),
);

const TABLE_OPTIONS: TableProps<IncidentWrapper>['options'] = {
  sorting: true,
  thirdSortClick: false,
  search: false, // Search is sent to the Rootly API instead
  paging: true,
  actionsColumnIndex: -1,
  pageSize: DEFAULT_PAGE_SIZE,
  padding: 'dense',
};

const TABLE_LOCALIZATION: TableProps<IncidentWrapper>['localization'] = {
  header: { actions: undefined },
  body: { emptyDataSourceMessage: 'No incidents' },
};

export const IncidentsTable = ({
  organizationId,
  params: paramsProp,
  showFilters = true,
}: {
  organizationId?: string;
  /** Scope applied to every request; its filters cannot be changed in the UI. */
  params?: RootlyIncidentsFetchOpts;
  /** Show the status/severity/team/service/environment filter bar. */
  showFilters?: boolean;
}) => {
  const classes = useStyles();
  const rootlyClient = useRootlyClient({organizationId: organizationId});

  const settings = useRootlyInstanceSettings({ organizationId });
  const [showTestIncidents, setShowTestIncidents] = useState(
    settings.showTestIncidents,
  );
  useEffect(
    () => setShowTestIncidents(settings.showTestIncidents),
    [settings.showTestIncidents],
  );

  // Callers usually pass `params` inline; key it by value so a re-render of the
  // parent does not trigger a refetch.
  const paramsKey = JSON.stringify(paramsProp ?? {});
  const params = useMemo(
    () => JSON.parse(paramsKey) as RootlyIncidentsFetchOpts,
    [paramsKey],
  );

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  useDebounce(() => setSearchTerm(searchInput), SEARCH_DEBOUNCE_MS, [
    searchInput,
  ]);
  const [filters, setFilters] = useState<IncidentFilters>(
    EMPTY_INCIDENT_FILTERS,
  );
  const [error, setError] = useState<Error | undefined>();

  const availableFilters = useMemo(
    () => availableIncidentFilters(params.filter as Record<string, unknown>),
    [params],
  );

  // Pagination, sort, filters and search are all applied by the Rootly API so
  // they cover every incident, not only the rows of the current page.
  const fetchIncidents = useCallback(
    async (query: Query): ReturnType<RemoteData> => {
      try {
        const response = await rootlyClient.getIncidents(
          buildIncidentsQuery({
            params,
            search: searchTerm,
            filters,
            page: { number: query.page + 1, size: query.pageSize },
            sort: {
              field: query.orderBy?.field as string | undefined,
              direction: query.orderDirection,
            },
            showTestIncidents,
          }),
        );
        setError(undefined);
        return {
          data: response.data.map(
            (i: RootlyIncident) => new IncidentWrapper(i, response.included),
          ),
          page: query.page,
          totalCount: response.meta?.total_count ?? response.data.length,
        };
      } catch (e) {
        setError(e as Error);
        return { data: [], page: 0, totalCount: 0 };
      }
    },
    [rootlyClient, params, searchTerm, filters, showTestIncidents],
  );

  // Material Table only calls remote data on its own events (page, sort), so
  // refetch from the first page whenever the query inputs change.
  const tableRef = useRef<{ onQueryChange?: (query?: object) => void }>();
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    tableRef.current?.onQueryChange?.({ page: 0 });
  }, [fetchIncidents]);

  return (
    <>
      {showFilters && (
        <IncidentsFilters
          client={rootlyClient}
          available={availableFilters}
          filters={filters}
          onFiltersChange={setFilters}
          showTestIncidents={showTestIncidents}
          onShowTestIncidentsChange={setShowTestIncidents}
        />
      )}
      <div className={classes.searchContainer}>
        <SearchBarBase
          onChange={setSearchInput}
          placeholder="Search Incidents"
          value={searchInput}
        />
      </div>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Table<IncidentWrapper>
        tableRef={tableRef}
        options={TABLE_OPTIONS}
        localization={TABLE_LOCALIZATION}
        columns={INCIDENT_COLUMNS}
        data={fetchIncidents}
      />
    </>
  );
};
