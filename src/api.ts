import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import qs from 'qs';
import { Entity, Incident, Service } from './types';

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
  getIncidents(opts?: IncidentsFetchOpts): Promise<IncidentsResponse>;
  importEntity(entity: Entity): Promise<void>;
  updateEntity(
    entity: Entity,
    service: Service,
    old_service?: Service,
  ): Promise<void>;
  deleteEntity(service: Service): Promise<void>;

  getCreateIncidentURL(): string;
  getListIncidents(): string;
  getListIncidentsForServiceURL(service: Service): string;
  getServiceDetailsURL(service: Service): string;

  getServiceIncidentsChart(service: Service, opts?: {period: string}): Promise<{data: object}>;
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

  async getIncidents(opts?: IncidentsFetchOpts): Promise<IncidentsResponse> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<IncidentsResponse>(
      `/v1/incidents?${params}`,
      init,
    );
    return response;
  }

  async getServiceIncidentsChart(service: Service, opts?: {period: string}): Promise<{data: object}> {
    const init = { headers: { 'Content-Type': 'application/vnd.api+json' } };
    const params = qs.stringify(opts, { encode: false });
    const response = await this.fetch<{data: object}>(
      `/v1/services/${service.id}/incidents_chart?${params}`,
      init,
    );
    return response;
  }

  async importEntity(entity: Entity): Promise<void> {
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

  async updateEntity(
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

  async deleteEntity(service: Service): Promise<void> {
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

  getCreateIncidentURL(): string {
    return `${this.domain}/account/incidents/new`;
  }

  getListIncidents(): string {
    return `${this.domain}/account/incidents`;
  }

  getListIncidentsForServiceURL(service: Service): string {
    const params = qs.stringify({services: [service.attributes.slug]}, { arrayFormat: 'brackets' });
    return `${this.domain}/account/incidents?${params}`;
  }

  getServiceDetailsURL(service: Service): string {
    return `${this.domain}/account/services/${service.attributes.slug}`;
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
