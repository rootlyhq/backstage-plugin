import { Entity as BackstageEntity } from '@backstage/catalog-model';
export interface Service {
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
export interface Functionality {
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
export interface Relationship {
    id: string;
    type: string;
    data: [{
        id: string;
        type: string;
    }];
}
export interface User {
    id: string;
    type: string;
    attributes: {
        name: string;
        email: string;
        full_name: string;
    };
}
export interface Group {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        color: string;
    };
}
export interface IncidentType {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        color: string;
    };
}
export interface Environment {
    id: string;
    type: string;
    attributes: {
        name: string;
        slug: string;
        description: string | undefined;
        color: string;
    };
}
export interface Severity {
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
export interface ResponderRef {
    id: string;
    type: string;
}
export interface Incident {
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
        url: string;
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
export interface Entity extends BackstageEntity {
    linkedService: Service | undefined;
    linkedFunctionality: Functionality | undefined;
}
