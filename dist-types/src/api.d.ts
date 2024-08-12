import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { RootlyEntity } from './types';
import { RootlyIncident, RootlyService, RootlyFunctionality, RootlyTeam } from '@rootly/backstage-plugin-common';
export declare const RootlyApiRef: import("@backstage/core-plugin-api").ApiRef<RootlyApi>;
export declare type RootlyServicesFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
export declare type RootlyFunctionalitiesFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
export declare type RootlyTeamsFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
export declare type RootlyIncidentsFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
export interface Rootly {
    getService(id_or_slug: String): Promise<RootlyServiceResponse>;
    getServices(opts?: RootlyServicesFetchOpts): Promise<RootlyServicesResponse>;
    getFunctionality(id_or_slug: String): Promise<RootlyFunctionalityResponse>;
    getFunctionalities(opts?: RootlyFunctionalitiesFetchOpts): Promise<RootlyFunctionalitiesResponse>;
    getTeam(id_or_slug: String): Promise<RootlyTeamResponse>;
    getTeams(opts?: RootlyTeamsFetchOpts): Promise<RootlyTeamsResponse>;
    getIncidents(opts?: RootlyIncidentsFetchOpts): Promise<RootlyIncidentsResponse>;
    importServiceEntity(entity: RootlyEntity): Promise<void>;
    updateServiceEntity(entity: RootlyEntity, service: RootlyService, old_service?: RootlyService): Promise<void>;
    deleteServiceEntity(service: RootlyService): Promise<void>;
    importFunctionalityEntity(entity: RootlyEntity): Promise<void>;
    updateFunctionalityEntity(entity: RootlyEntity, functionality: RootlyFunctionality, old_functionality?: RootlyFunctionality): Promise<void>;
    deleteFunctionalityEntity(functionality: RootlyFunctionality): Promise<void>;
    importTeamEntity(entity: RootlyEntity): Promise<void>;
    updateTeamEntity(entity: RootlyEntity, functionality: RootlyTeam, old_functionality?: RootlyTeam): Promise<void>;
    deleteTeamEntity(team: RootlyTeam): Promise<void>;
    getCreateIncidentURL(): string;
    getListIncidents(): string;
    getListIncidentsForServiceURL(service: RootlyService): string;
    getServiceDetailsURL(service: RootlyService): string;
    getServiceIncidentsChart(service: RootlyService, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    getListIncidentsForFunctionalityURL(functionality: RootlyFunctionality): string;
    getFunctionalityDetailsURL(functionality: RootlyFunctionality): string;
    getFunctionalityIncidentsChart(functionality: RootlyFunctionality, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    getListIncidentsForTeamURL(team: RootlyTeam): string;
    getTeamDetailsURL(team: RootlyTeam): string;
    getTeamIncidentsChart(team: RootlyTeam, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
}
interface RootlyServiceResponse {
    data: RootlyService;
}
interface RootlyServicesResponse {
    meta: {
        total_count: number;
        total_pages: number;
    };
    data: RootlyService[];
}
interface RootlyFunctionalityResponse {
    data: RootlyFunctionality;
}
interface RootlyFunctionalitiesResponse {
    meta: {
        total_count: number;
        total_pages: number;
    };
    data: RootlyFunctionality[];
}
interface RootlyTeamResponse {
    data: RootlyTeam;
}
interface RootlyTeamsResponse {
    meta: {
        total_count: number;
        total_pages: number;
    };
    data: RootlyTeam[];
}
interface RootlyIncidentsResponse {
    meta: {
        total_count: number;
        total_pages: number;
    };
    data: RootlyIncident[];
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
    getService(id_or_slug: String): Promise<RootlyServiceResponse>;
    getServices(opts?: RootlyServicesFetchOpts): Promise<RootlyServicesResponse>;
    getFunctionality(id_or_slug: String): Promise<RootlyFunctionalityResponse>;
    getFunctionalities(opts?: RootlyFunctionalitiesFetchOpts): Promise<RootlyFunctionalitiesResponse>;
    getTeam(id_or_slug: String): Promise<RootlyTeamResponse>;
    getTeams(opts?: RootlyTeamsFetchOpts): Promise<RootlyTeamsResponse>;
    getIncidents(opts?: RootlyIncidentsFetchOpts): Promise<RootlyIncidentsResponse>;
    getServiceIncidentsChart(service: RootlyService, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    getFunctionalityIncidentsChart(functionality: RootlyFunctionality, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    getTeamIncidentsChart(team: RootlyTeam, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
    importServiceEntity(entity: RootlyEntity): Promise<void>;
    updateServiceEntity(entity: RootlyEntity, service: RootlyService, old_service?: RootlyService): Promise<void>;
    deleteServiceEntity(service: RootlyService): Promise<void>;
    importFunctionalityEntity(entity: RootlyEntity): Promise<void>;
    updateFunctionalityEntity(entity: RootlyEntity, functionality: RootlyFunctionality, old_functionality?: RootlyFunctionality): Promise<void>;
    deleteFunctionalityEntity(functionality: RootlyFunctionality): Promise<void>;
    importTeamEntity(entity: RootlyEntity): Promise<void>;
    updateTeamEntity(entity: RootlyEntity, team: RootlyTeam, old_team?: RootlyTeam): Promise<void>;
    deleteTeamEntity(team: RootlyTeam): Promise<void>;
    getCreateIncidentURL(): string;
    getListIncidents(): string;
    getListIncidentsForServiceURL(service: RootlyService): string;
    getListIncidentsForFunctionalityURL(functionality: RootlyFunctionality): string;
    getListIncidentsForTeamURL(team: RootlyTeam): string;
    getServiceDetailsURL(service: RootlyService): string;
    getFunctionalityDetailsURL(functionality: RootlyFunctionality): string;
    getTeamDetailsURL(team: RootlyTeam): string;
    private apiUrl;
    private addAuthHeaders;
}
export {};
