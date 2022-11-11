import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { Entity, Incident, Service } from './types';
export declare const RootlyApiRef: import("@backstage/core-plugin-api").ApiRef<Rootly>;
export declare type ServicesFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
export declare type IncidentsFetchOpts = {
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
    updateEntity(entity: Entity, old_service: Service, service: Service): Promise<void>;
    deleteEntity(service: Service): Promise<void>;
    getCreateIncidentURL(): string;
    getListIncidents(): string;
    getListIncidentsForServiceURL(service: Service): string;
    getServiceDetailsURL(service: Service): string;
    getServiceIncidentsChart(service: Service, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
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
declare type Options = {
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
export declare class RootlyApi implements Rootly {
    private readonly discoveryApi;
    private readonly identityApi;
    private readonly proxyPath;
    private readonly domain;
    constructor(opts: Options);
    private fetch;
    private call;
    getService(id_or_slug: String): Promise<ServiceResponse>;
    getServices(opts?: ServicesFetchOpts): Promise<ServicesResponse>;
    getIncidents(opts?: IncidentsFetchOpts): Promise<IncidentsResponse>;
    getServiceIncidentsChart(service: Service, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    importEntity(entity: Entity): Promise<void>;
    updateEntity(entity: Entity, old_service: Service, service: Service): Promise<void>;
    deleteEntity(service: Service): Promise<void>;
    getCreateIncidentURL(): string;
    getListIncidents(): string;
    getListIncidentsForServiceURL(service: Service): string;
    getServiceDetailsURL(service: Service): string;
    private apiUrl;
    private addAuthHeaders;
}
export {};
