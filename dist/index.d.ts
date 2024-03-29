/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { Entity as Entity$1 } from '@backstage/catalog-model';

declare const RootlyPage: () => JSX.Element;
declare const RootlyOverviewCard: () => JSX.Element;
declare const RootlyIncidentsPage: () => JSX.Element;

declare const RootlyPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    explore: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;

interface Service {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        public_description: string | undefined;
        color: string;
        notify_emails: string[];
        slack_channels: object[];
        slack_aliases: object[];
        backstage_id: string | undefined;
        incidents_count: BigInteger;
        created_at: string;
        updated_at: string;
    };
}
interface Functionality {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        public_description: string | undefined;
        color: string;
        user: {
            data: User;
        } | undefined;
        severity: {
            data: Severity;
        } | undefined;
        notify_emails: string[];
        slack_channels: object[];
        slack_aliases: object[];
        backstage_id: string | undefined;
        created_at: string;
        updated_at: string;
    };
}
interface Relationship {
    id: string;
    type: string;
    data: [{
        id: string;
        type: string;
    }];
}
interface User {
    id: string;
    type: string;
    attributes: {
        name: string;
        email: string;
        full_name: string;
    };
}
interface Group {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        color: string;
    };
}
interface IncidentType {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        color: string;
    };
}
interface Environment {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        color: string;
    };
}
interface Severity {
    id: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        severity: string | undefined;
        color: string;
        created_at: string;
        updated_at: string;
    };
}
interface Incident {
    id: string;
    type: string;
    attributes: {
        title: string;
        slug: string;
        summary: string | undefined;
        status: string;
        labels: string[];
        severity: {
            data: Severity;
        } | undefined;
        user: {
            data: User;
        } | undefined;
        created_at: string;
        updated_at: string;
    };
    relationships: {
        services: Relationship | undefined;
        functionalities: Relationship | undefined;
        incident_types: Relationship | undefined;
        environments: Relationship | undefined;
        groups: Relationship | undefined;
    };
    included: [
        {
            id: string;
            type: string;
            attributes: Group | Environment | Service | Functionality | IncidentType;
        }
    ];
}
interface Entity extends Entity$1 {
    linkedService: Service | undefined;
}

declare const RootlyApiRef: _backstage_core_plugin_api.ApiRef<Rootly>;
declare type ServicesFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
declare type IncidentsFetchOpts = {
    page?: {
        number?: number;
        size?: number;
    };
    filter?: object;
    include?: string;
};
interface Rootly {
    getServices(opts?: ServicesFetchOpts): Promise<ServicesResponse>;
    getIncidents(opts?: IncidentsFetchOpts): Promise<IncidentsResponse>;
    importEntity(entity: Entity): Promise<void>;
    updateEntity(entity: Entity, old_service: Service, service: Service): Promise<void>;
    deleteEntity(service: Service): Promise<void>;
    getCreateIncidentURL(): string;
    getListIncidents(): string;
    getListIncidentsForServiceURL(service: Service): string;
    getServiceDetailsURL(service: Service): string;
    getIncidentDetailsURL(incident: Incident): string;
    getServiceIncidentsChart(service: Service, opts?: {
        period: string;
    }): Promise<{
        data: object;
    }>;
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
declare class RootlyApi implements Rootly {
    private readonly discoveryApi;
    private readonly identityApi;
    private readonly proxyPath;
    private readonly domain;
    constructor(opts: Options);
    private fetch;
    private call;
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
    getIncidentDetailsURL(incident: Incident): string;
    private apiUrl;
    private addAuthHeaders;
}

declare const isRootlyAvailable: (entity: Entity$1) => boolean;

declare const ServicesTable: ({ params }: {
    params?: ServicesFetchOpts | undefined;
}) => JSX.Element;

declare const IncidentsTable: ({ params }: {
    params?: IncidentsFetchOpts | undefined;
}) => JSX.Element;

declare const ServicesDialog: ({ open, entity, handleClose, handleImport, handleUpdate, }: {
    open: boolean;
    entity: Entity;
    handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
    handleImport: Function;
    handleUpdate: Function;
}) => JSX.Element;

export { type IncidentsFetchOpts, IncidentsTable, type Rootly, RootlyApi, RootlyApiRef, RootlyIncidentsPage, RootlyOverviewCard, RootlyPage, RootlyPlugin, ServicesDialog, type ServicesFetchOpts, ServicesTable, isRootlyAvailable };
