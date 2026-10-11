import { RootlyIncidentsFetchOpts } from '@rootly/backstage-plugin-common';

/**
 * Incident kinds the Rootly API flags as test incidents. They are excluded
 * unless test incidents are explicitly requested.
 */
export const TEST_INCIDENT_KINDS = ['test', 'test_sub'];

/**
 * Columns the Rootly API can sort on (`sort` param of `GET /v1/incidents`),
 * keyed by table column field. Other columns are not sortable server-side.
 */
export const SORTABLE_INCIDENT_FIELDS: Record<string, string> = {
  'incident.attributes.started_at': 'started_at',
  'incident.attributes.mitigated_at': 'mitigated_at',
  'incident.attributes.resolved_at': 'resolved_at',
};

export const DEFAULT_INCIDENTS_SORT = '-started_at';

export type IncidentFilterOption = {
  id: string;
  label: string;
};

export type IncidentFilterKey =
  | 'status'
  | 'severity'
  | 'teams'
  | 'services'
  | 'environments';

export type IncidentFilters = Record<IncidentFilterKey, IncidentFilterOption[]>;

export const EMPTY_INCIDENT_FILTERS: IncidentFilters = {
  status: [],
  severity: [],
  teams: [],
  services: [],
  environments: [],
};

/** Rootly API `filter[...]` param each UI filter is sent as. */
export const INCIDENT_FILTER_PARAMS: Record<IncidentFilterKey, string> = {
  status: 'status',
  severity: 'severity_id',
  teams: 'team_ids',
  services: 'service_ids',
  environments: 'environment_ids',
};

/**
 * The Rootly API ORs every relationship filter (environments, services,
 * functionalities, teams, types, causes) together. These filters can only
 * narrow results when no relationship scope is set already.
 */
export const RELATIONSHIP_FILTER_PARAMS = [
  'environments',
  'environment_ids',
  'services',
  'service_ids',
  'service_names',
  'functionalities',
  'functionality_ids',
  'functionality_names',
  'teams',
  'team_ids',
  'team_names',
  'groups',
  'types',
  'type_ids',
  'causes',
  'cause_ids',
];

const RELATIONSHIP_FILTER_KEYS: IncidentFilterKey[] = [
  'teams',
  'services',
  'environments',
];

const hasValue = (value: unknown) =>
  value !== undefined && value !== null && value !== '';

/**
 * Returns the UI filters that can be offered given the filters the table is
 * already scoped to (for example an entity page scoped to one service).
 */
export const availableIncidentFilters = (
  scope: Record<string, unknown> = {},
): IncidentFilterKey[] => {
  const scopedToRelationship = RELATIONSHIP_FILTER_PARAMS.some(param =>
    hasValue(scope[param]),
  );
  return (Object.keys(INCIDENT_FILTER_PARAMS) as IncidentFilterKey[]).filter(
    key => {
      if (RELATIONSHIP_FILTER_KEYS.includes(key)) {
        return !scopedToRelationship;
      }
      if (key === 'severity') {
        return !hasValue(scope.severity) && !hasValue(scope.severity_id);
      }
      return !hasValue(scope[INCIDENT_FILTER_PARAMS[key]]);
    },
  );
};

export type IncidentsSort = {
  field?: string;
  direction?: 'asc' | 'desc' | '';
};

/** Converts a table sort into the Rootly API `sort` param. */
export const toIncidentsSortParam = (sort?: IncidentsSort): string => {
  const apiField = sort?.field ? SORTABLE_INCIDENT_FIELDS[sort.field] : undefined;
  if (!apiField) {
    return DEFAULT_INCIDENTS_SORT;
  }
  return sort?.direction === 'asc' ? apiField : `-${apiField}`;
};

export type IncidentsQueryOptions = RootlyIncidentsFetchOpts;

/**
 * Builds the `GET /v1/incidents` options: the table scope from `params`, the
 * user's search, filters, pagination and sort, and the test incident filter.
 * Filters already set in `params` always win over user filters.
 */
export const buildIncidentsQuery = ({
  params,
  search,
  filters = EMPTY_INCIDENT_FILTERS,
  page,
  sort,
  showTestIncidents,
}: {
  params?: RootlyIncidentsFetchOpts;
  search?: string;
  filters?: IncidentFilters;
  page: { number: number; size: number };
  sort?: IncidentsSort;
  showTestIncidents: boolean;
}): IncidentsQueryOptions => {
  // Drop empty scope values so they never mask a user-selected filter.
  const scope = Object.fromEntries(
    Object.entries((params?.filter ?? {}) as Record<string, unknown>).filter(
      ([, value]) => hasValue(value),
    ),
  );
  const allowed = availableIncidentFilters(scope);

  const filter: Record<string, unknown> = { search };

  for (const key of allowed) {
    const selected = filters[key];
    if (selected.length > 0) {
      filter[INCIDENT_FILTER_PARAMS[key]] = selected.map(o => o.id).join(',');
    }
  }

  if (!showTestIncidents && !hasValue(scope.kind)) {
    filter.kind = { not_in: TEST_INCIDENT_KINDS.join(',') };
  }

  return {
    ...params,
    filter: { ...filter, ...scope },
    page,
    sort: toIncidentsSortParam(sort),
  };
};
