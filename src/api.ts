import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import qs from 'qs';
import { Entity, Incident, Service, Functionality, Team } from './types';

export const RootlyApiRef = createApiRef<Rootly>({
  id: 'plugin.rootly.service',
});

export type ServicesFetchOpts = {
  page?: {
    number?: number;
    size?: number;
  };
  filter?: object;
  include?: string;
};

export type FunctionalitiesFetchOpts = {
  page?: {
    number?: number;
    size?: number;
  };
  filter?: object;
  include?: string;
};

export type TeamsFetchOpts = {
  page?: {
    number?: number;
    size?: number;
  };
  filter?: object;
  include?: string;
};

export type IncidentsFetchOpts = {
  page?: {
    number?: number;
    size?: number;
  };
  filter?: object;
  include?: string;
};

export interface Rootly {
  getService(id_or_slug: String): Promise<ServiceResponse>;
  getServices(opts?: ServicesFetchOpts): Promise<ServicesResponse>;
  getFunctionality(id_or_slug: String): Promise<FunctionalityResponse>;
  getFunctionalities(
    opts?: FunctionalitiesFetchOpts,
  ): Promise<FunctionalitiesResponse>;
  getTeam(id_or_slug: String): Promise<TeamResponse>;
  getTeams(opts?: TeamsFetchOpts): Promise<TeamsResponse>;
  getIncidents(opts?: IncidentsFetchOpts): Promise<IncidentsResponse>;

  importServiceEntity(entity: Entity): Promise<void>;
  updateServiceEntity(
    entity: Entity,
    service: Service,
    old_service?: Service,
  ): Promise<void>;
  deleteServiceEntity(service: Service): Promise<void>;

  importFunctionalityEntity(entity: Entity): Promise<void>;
  updateFunctionalityEntity(
    entity: Entity,
    functionality: Functionality,
    old_functionality?: Functionality,
  ): Promise<void>;
  deleteFunctionalityEntity(functionality: Functionality): Promise<void>;

  importTeamEntity(entity: Entity): Promise<void>;
  updateTeamEntity(
    entity: Entity,
    functionality: Team,
    old_functionality?: Team,
  ): Promise<void>;
  deleteTeamEntity(team: Team): Promise<void>;

  getCreateIncidentURL(): string;
  getListIncidents(): string;

  getListIncidentsForServiceURL(service: Service): string;
  getServiceDetailsURL(service: Service): string;
  getServiceIncidentsChart(
    service: Service,
    opts?: { period: string },
  ): Promise<{ data: object }>;

  getListIncidentsForFunctionalityURL(functionality: Functionality): string;
  getFunctionalityDetailsURL(functionality: Functionality): string;
  getFunctionalityIncidentsChart(
    functionality: Functionality,
    opts?: { period: string },
  ): Promise<{ data: object }>;

  getListIncidentsForTeamURL(team: Team): string;
  getTeamDetailsURL(team: Team): string;
  getTeamIncidentsChart(
    team: Team,
    opts?: { period: string },
  ): Promise<{ data: object }>;
}

interface ServiceResponse {
  data: Service;
}

interface ServicesResponse {
  meta: {
    total_count: number;
    total_pages: number;
  };
  data: Service[];
}

interface FunctionalityResponse {
  data: Functionality;
}

interface FunctionalitiesResponse {
  meta: {
    total_count: number;
    total_pages: number;
  };
  data: Functionality[];
}

interface TeamResponse {
  data: Team;
}

interface TeamsResponse {
  meta: {
    total_count: number;
    total_pages: number;
  };
  data: Team[];
}

interface IncidentsResponse {
  meta: {
    total_count: number;
    total_pages: number;
  };
  data: Incident[];
  included: object[];
  links: {
    first: string;
    last: string;
    next?: string;
    prev?: string;
    self: string;
  };
}

const DEFAULT_PROXY_PATH = '/rootly/api';

type Options = {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;

  /**
   * Domain used by users to access Rootly web UI.
   * Example: https://rootly.com
   */
  domain: string;

  /**
   * Path to use for requests via the proxy, defaults to /rootly/api
   */
  proxyPath?: string;
};

/**
 * API to talk to Rootly.
 */
export class RootlyApi implements Rootly {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly proxyPath: string;
  private readonly domain: string;

  constructor(opts: Options) {
    this.discoveryApi = opts.discoveryApi;
    this.identityApi = opts.identityApi;
    this.domain = opts.domain;
    this.proxyPath = opts.proxyPath ?? DEFAULT_PROXY_PATH;
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const apiUrl = await this.apiUrl();
    const authedInit = await this.addAuthHeaders(init || {});

    const resp = await fetch(`${apiUrl}${input}`, authedInit);
    if (!resp.ok) {
      throw new Error(`Request failed with ${resp.status} ${resp.statusText}`);
    }

    return await resp.json();
  }

  private async call(input: string, init?: RequestInit): Promise<void> {
    const apiUrl = await this.apiUrl();
    const authedInit = await this.addAuthHeaders(init || {});

    const resp = await fetch(`${apiUrl}${input}`, authedInit);
    if (!resp.ok)
      throw new Error(`Request failed with ${resp.status}: ${resp.statusText}`);
  }

  async getService(id_or_slug: String): Promise<ServiceResponse> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const response = await this.fetch<ServiceResponse>(
      `/v1/services/${id_or_slug}`,
      init,
    );
    return response;
  }

  async getServices(opts?: ServicesFetchOpts): Promise<ServicesResponse> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<ServicesResponse>(
      `/v1/services?${params}`,
      init,
    );
    return response;
  }

  async getFunctionality(id_or_slug: String): Promise<FunctionalityResponse> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const response = await this.fetch<FunctionalityResponse>(
      `/v1/functionalities/${id_or_slug}`,
      init,
    );
    return response;
  }

  async getFunctionalities(
    opts?: FunctionalitiesFetchOpts,
  ): Promise<FunctionalitiesResponse> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<FunctionalitiesResponse>(
      `/v1/functionalities?${params}`,
      init,
    );
    return response;
  }

  async getTeam(id_or_slug: String): Promise<TeamResponse> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const response = await this.fetch<TeamResponse>(
      `/v1/teams/${id_or_slug}`,
      init,
    );
    return response;
  }

  async getTeams(opts?: TeamsFetchOpts): Promise<TeamsResponse> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<TeamsResponse>(
      `/v1/teams?${params}`,
      init,
    );
    return response;
  }

  async getIncidents(opts?: IncidentsFetchOpts): Promise<IncidentsResponse> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<IncidentsResponse>(
      `/v1/incidents?${params}`,
      init,
    );
    return response;
  }

  async getServiceIncidentsChart(
    service: Service,
    opts?: { period: string },
  ): Promise<{ data: object }> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<{ data: object }>(
      `/v1/services/${service.id}/incidents_chart?${params}`,
      init,
    );
    return response;
  }

  async getFunctionalityIncidentsChart(
    functionality: Functionality,
    opts?: { period: string },
  ): Promise<{ data: object }> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<{ data: object }>(
      `/v1/functionalities/${functionality.id}/incidents_chart?${params}`,
      init,
    );
    return response;
  }

  async getTeamIncidentsChart(
    team: Team,
    opts?: { period: string },
  ): Promise<{ data: object }> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<{ data: object }>(
      `/v1/teams/${team.id}/incidents_chart?${params}`,
      init,
    );
    return response;
  }

  async importServiceEntity(entity: Entity): Promise<void> {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name,
    });
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'services',
          attributes: {
            name: entity.metadata.name,
            description: entity.metadata.description,
            backstage_id: entityTriplet,
          },
        },
      }),
    };

    await this.call(`/v1/services`, init);
  }

  async updateServiceEntity(
    entity: Entity,
    service: Service,
    old_service?: Service,
  ): Promise<void> {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name,
    });

    if (old_service?.id) {
      const init1 = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/vnd.api+json' },
        body: JSON.stringify({
          data: {
            type: 'services',
            attributes: {
              backstage_id: null,
            },
          },
        }),
      };

      await this.call(`/v1/services/${old_service.id}`, init1);
    }

    const init2 = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'services',
          attributes: {
            backstage_id: entityTriplet,
          },
        },
      }),
    };

    await this.call(`/v1/services/${service.id}`, init2);
  }

  async deleteServiceEntity(service: Service): Promise<void> {
    const init = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'services',
          attributes: {
            backstage_id: null,
          },
        },
      }),
    };

    await this.call(`/v1/services/${service.id}`, init);
  }

  async importFunctionalityEntity(entity: Entity): Promise<void> {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name,
    });
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'functionalities',
          attributes: {
            name: entity.metadata.name,
            description: entity.metadata.description,
            backstage_id: entityTriplet,
          },
        },
      }),
    };

    await this.call(`/v1/functionalities`, init);
  }

  async updateFunctionalityEntity(
    entity: Entity,
    functionality: Functionality,
    old_functionality?: Functionality,
  ): Promise<void> {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name,
    });

    if (old_functionality?.id) {
      const init1 = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/vnd.api+json' },
        body: JSON.stringify({
          data: {
            type: 'functionalities',
            attributes: {
              backstage_id: null,
            },
          },
        }),
      };

      await this.call(`/v1/functionalities/${old_functionality.id}`, init1);
    }

    const init2 = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'functionalities',
          attributes: {
            backstage_id: entityTriplet,
          },
        },
      }),
    };

    await this.call(`/v1/functionalities/${functionality.id}`, init2);
  }

  async deleteFunctionalityEntity(functionality: Functionality): Promise<void> {
    const init = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'functionalities',
          attributes: {
            backstage_id: null,
          },
        },
      }),
    };

    await this.call(`/v1/functionalities/${functionality.id}`, init);
  }

  async importTeamEntity(entity: Entity): Promise<void> {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name,
    });
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'teams',
          attributes: {
            name: entity.metadata.name,
            description: entity.metadata.description,
            backstage_id: entityTriplet,
          },
        },
      }),
    };

    await this.call(`/v1/teams`, init);
  }

  async updateTeamEntity(
    entity: Entity,
    team: Team,
    old_team?: Team,
  ): Promise<void> {
    const entityTriplet = stringifyEntityRef({
      namespace: entity.metadata.namespace,
      kind: entity.kind,
      name: entity.metadata.name,
    });

    if (old_team?.id) {
      const init1 = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/vnd.api+json' },
        body: JSON.stringify({
          data: {
            type: 'teams',
            attributes: {
              backstage_id: null,
            },
          },
        }),
      };

      await this.call(`/v1/teams/${old_team.id}`, init1);
    }

    const init2 = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'teams',
          attributes: {
            backstage_id: entityTriplet,
          },
        },
      }),
    };

    await this.call(`/v1/teams/${team.id}`, init2);
  }

  async deleteTeamEntity(team: Team): Promise<void> {
    const init = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: JSON.stringify({
        data: {
          type: 'teams',
          attributes: {
            backstage_id: null,
          },
        },
      }),
    };

    await this.call(`/v1/teams/${team.id}`, init);
  }

  getCreateIncidentURL(): string {
    return `${this.domain}/account/incidents/new`;
  }

  getListIncidents(): string {
    return `${this.domain}/account/incidents`;
  }

  getListIncidentsForServiceURL(service: Service): string {
    const params = qs.stringify(
      { filter: { filters: [{ services: [service.id] }] } },
      { arrayFormat: 'brackets' },
    );
    return `${this.domain}/account/incidents?${params}`;
  }

  getListIncidentsForFunctionalityURL(functionality: Functionality): string {
    const params = qs.stringify(
      { filter: { filters: [{ functionalities: [functionality.id] }] } },
      { arrayFormat: 'brackets' },
    );
    return `${this.domain}/account/incidents?${params}`;
  }

  getListIncidentsForTeamURL(team: Team): string {
    const params = qs.stringify(
      { filter: { filters: [{ groups: [team.id] }] } },
      { arrayFormat: 'brackets' },
    );
    return `${this.domain}/account/incidents?${params}`;
  }

  getServiceDetailsURL(service: Service): string {
    return `${this.domain}/account/services/${service.attributes.slug}`;
  }

  getFunctionalityDetailsURL(functionality: Functionality): string {
    return `${this.domain}/account/functionalities/${functionality.attributes.slug}`;
  }

  getTeamDetailsURL(team: Team): string {
    return `${this.domain}/account/teams/${team.attributes.slug}`;
  }

  private async apiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }

  private async addAuthHeaders(init: RequestInit): Promise<RequestInit> {
    const { token } = await this.identityApi.getCredentials();
    const headers = init.headers || {};

    return {
      ...init,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }
}
