import { Environment, Functionality, Team, Incident, IncidentType, Service } from '../../types';
export declare class IncidentWrapper {
    incident: Incident;
    included: any;
    constructor(incident: Incident, included: any);
    environments: () => Environment[];
    services: () => Service[];
    functionalities: () => Functionality[];
    groups: () => Team[];
    types: () => IncidentType[];
}
