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

const toOptions = (response?: NamedResourceList): IncidentFilterOption[] =>
  (response?.data ?? []).map(resource => ({
    id: resource.id,
    label: resource.attributes.name,
  }));

const listOpts = (search: string) => ({
  page: { size: OPTIONS_PAGE_SIZE },
  filter: { search },
});

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
    // Custom clients provided by the app may predate these lookups.
    case 'severity':
      return typeof client.getSeverities === 'function'
        ? toOptions(await client.getSeverities(listOpts(search)))
        : [];
    case 'environments':
      return typeof client.getEnvironments === 'function'
        ? toOptions(await client.getEnvironments(listOpts(search)))
        : [];
    default:
      return [];
  }
};
