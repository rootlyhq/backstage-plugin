import { Environment, Functionality, Group, Incident, IncidentType, Service } from '../../types';
export declare class IncidentWrapper {
    incident: Incident;
    included: any;
    constructor(incident: Incident, included: any);
    environments: () => Environment[];
    services: () => Service[];
    functionalities: () => Functionality[];
    groups: () => Group[];
    types: () => IncidentType[];
}
