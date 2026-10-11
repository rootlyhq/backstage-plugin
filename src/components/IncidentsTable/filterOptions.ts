import { RootlyApi } from '@rootly/backstage-plugin-common';
import { IncidentFilterKey, IncidentFilterOption } from './incidentsQuery';

const OPTIONS_PAGE_SIZE = 50;

/** Incident statuses accepted by the Rootly API `filter[status]` param. */
export const INCIDENT_STATUS_OPTIONS: IncidentFilterOption[] = [
  { id: 'in_triage', label: 'In triage' },
  { id: 'started', label: 'Started' },
  { id: 'mitigated', label: 'Mitigated' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
];

type NamedResource = { id: string; attributes: { name: string } };
type NamedResourceList = { data?: NamedResource[] };

type RootlyFetcher = {
  fetch: (input: string, init?: RequestInit) => Promise<NamedResourceList>;
};

const toOptions = (response?: NamedResourceList): IncidentFilterOption[] =>
  (response?.data ?? []).map(resource => ({
    id: resource.id,
    label: resource.attributes.name,
  }));

const listOpts = (search: string) => ({
  page: { size: OPTIONS_PAGE_SIZE },
  filter: { search },
});

/**
 * `@rootly/backstage-plugin-common` has no public severities/environments
 * methods yet, so these go through the client's authenticated proxy fetch.
 */
const fetchNamedResources = async (
  client: RootlyApi,
  resource: 'severities' | 'environments',
  search: string,
): Promise<IncidentFilterOption[]> => {
  const fetcher = client as unknown as Partial<RootlyFetcher>;
  if (typeof fetcher.fetch !== 'function') {
    return [];
  }
  const query = new URLSearchParams({ 'page[size]': String(OPTIONS_PAGE_SIZE) });
  if (search) {
    query.set('filter[search]', search);
  }
  return toOptions(
    await fetcher.fetch(`/v1/${resource}?${query.toString()}`, {
      headers: { 'Content-Type': 'application/vnd.api+json' },
    }),
  );
};

/** Loads the options of a filter, narrowed by what the user typed. */
export const loadIncidentFilterOptions = async (
  client: RootlyApi,
  key: IncidentFilterKey,
  search: string,
): Promise<IncidentFilterOption[]> => {
  switch (key) {
    case 'status': {
      const term = search.toLowerCase();
      return INCIDENT_STATUS_OPTIONS.filter(option =>
        option.label.toLowerCase().includes(term),
      );
    }
    case 'teams':
      return toOptions(await client.getTeams(listOpts(search)));
    case 'services':
      return toOptions(await client.getServices(listOpts(search)));
    case 'severity':
      return fetchNamedResources(client, 'severities', search);
    case 'environments':
      return fetchNamedResources(client, 'environments', search);
    default:
      return [];
  }
};
