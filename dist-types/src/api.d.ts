import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { Entity, Incident, Service, Functionality, Team } from './types';
export declare const RootlyApiRef: import("@backstage/core-plugin-api").ApiRef<RootlyApi>;
export declare type ServicesFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
export declare type FunctionalitiesFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
export declare type TeamsFetchOpts = {
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
    getFunctionality(id_or_slug: String): Promise<FunctionalityResponse>;
    getFunctionalities(opts?: FunctionalitiesFetchOpts): Promise<FunctionalitiesResponse>;
    getTeam(id_or_slug: String): Promise<TeamResponse>;
    getTeams(opts?: TeamsFetchOpts): Promise<TeamsResponse>;
    getIncidents(opts?: IncidentsFetchOpts): Promise<IncidentsResponse>;
    importServiceEntity(entity: Entity): Promise<void>;
    updateServiceEntity(entity: Entity, service: Service, old_service?: Service): Promise<void>;
    deleteServiceEntity(service: Service): Promise<void>;
    importFunctionalityEntity(entity: Entity): Promise<void>;
    updateFunctionalityEntity(entity: Entity, functionality: Functionality, old_functionality?: Functionality): Promise<void>;
    deleteFunctionalityEntity(functionality: Functionality): Promise<void>;
    importTeamEntity(entity: Entity): Promise<void>;
    updateTeamEntity(entity: Entity, functionality: Team, old_functionality?: Team): Promise<void>;
    deleteTeamEntity(team: Team): Promise<void>;
    getCreateIncidentURL(): string;
    getListIncidents(): string;
    getListIncidentsForServiceURL(service: Service): string;
    getServiceDetailsURL(service: Service): string;
    getServiceIncidentsChart(service: Service, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    getListIncidentsForFunctionalityURL(functionality: Functionality): string;
    getFunctionalityDetailsURL(functionality: Functionality): string;
    getFunctionalityIncidentsChart(functionality: Functionality, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    getListIncidentsForTeamURL(team: Team): string;
    getTeamDetailsURL(team: Team): string;
    getTeamIncidentsChart(team: Team, opts?: {
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
export declare class RootlyApi {
    private readonly discoveryApi;
    private readonly identityApi;
    private readonly proxyPath;
    private readonly domain;
    constructor(opts: Options);
    private fetch;
    private call;
    getService(id_or_slug: String): Promise<ServiceResponse>;
    getServices(opts?: ServicesFetchOpts): Promise<ServicesResponse>;
    getFunctionality(id_or_slug: String): Promise<FunctionalityResponse>;
    getFunctionalities(opts?: FunctionalitiesFetchOpts): Promise<FunctionalitiesResponse>;
    getTeam(id_or_slug: String): Promise<TeamResponse>;
    getTeams(opts?: TeamsFetchOpts): Promise<TeamsResponse>;
    getIncidents(opts?: IncidentsFetchOpts): Promise<IncidentsResponse>;
    getServiceIncidentsChart(service: Service, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    getFunctionalityIncidentsChart(functionality: Functionality, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    getTeamIncidentsChart(team: Team, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    importServiceEntity(entity: Entity): Promise<void>;
    updateServiceEntity(entity: Entity, service: Service, old_service?: Service): Promise<void>;
    deleteServiceEntity(service: Service): Promise<void>;
    importFunctionalityEntity(entity: Entity): Promise<void>;
    updateFunctionalityEntity(entity: Entity, functionality: Functionality, old_functionality?: Functionality): Promise<void>;
    deleteFunctionalityEntity(functionality: Functionality): Promise<void>;
    importTeamEntity(entity: Entity): Promise<void>;
    updateTeamEntity(entity: Entity, team: Team, old_team?: Team): Promise<void>;
    deleteTeamEntity(team: Team): Promise<void>;
    getCreateIncidentURL(): string;
    getListIncidents(): string;
    getListIncidentsForServiceURL(service: Service): string;
    getListIncidentsForFunctionalityURL(functionality: Functionality): string;
    getListIncidentsForTeamURL(team: Team): string;
    getServiceDetailsURL(service: Service): string;
    getFunctionalityDetailsURL(functionality: Functionality): string;
    getTeamDetailsURL(team: Team): string;
    private apiUrl;
    private addAuthHeaders;
}
export {};
