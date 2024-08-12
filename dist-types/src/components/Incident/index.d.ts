import { RootlyIncident, RootlyIncidentType, RootlyEnvironment, RootlyFunctionality, RootlyService, RootlyTeam } from '@rootly/backstage-plugin-common';
export declare class IncidentWrapper {
    incident: RootlyIncident;
    included: any;
    constructor(incident: RootlyIncident, included: any);
    environments: () => RootlyEnvironment[];
    services: () => RootlyService[];
    functionalities: () => RootlyFunctionality[];
    groups: () => RootlyTeam[];
    types: () => RootlyIncidentType[];
}
