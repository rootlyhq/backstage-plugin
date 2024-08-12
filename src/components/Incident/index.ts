import { RootlyIncident, RootlyIncidentType, RootlyEnvironment, RootlyFunctionality, RootlyService, RootlyTeam } from '@rootly/backstage-plugin-common';

export class IncidentWrapper {
  incident: RootlyIncident;
  included: any;
  constructor(incident: RootlyIncident, included: any) {
    this.incident = incident;
    this.included = included;
  }

  environments = (): RootlyEnvironment[] => {
    if (this.incident.relationships?.environments?.data) {
      const ids = this.incident.relationships?.environments?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'environments' && ids.includes(i.id);
      });
    } 
      return [];
    
  };

  services = (): RootlyService[] => {
    if (this.incident.relationships?.services?.data) {
      const ids = this.incident.relationships?.services?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'services' && ids.includes(i.id);
      });
    } 
      return [];
    
  };

  functionalities = (): RootlyFunctionality[] => {
    if (this.incident.relationships?.functionalities?.data) {
      const ids = this.incident.relationships?.functionalities?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'functionalities' && ids.includes(i.id);
      });
    } 
      return [];
    
  };

  groups = (): RootlyTeam[] => {
    if (this.incident.relationships?.groups?.data) {
      const ids = this.incident.relationships?.groups?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'groups' && ids.includes(i.id);
      });
    } 
      return [];
    
  };

  types = (): RootlyIncidentType[] => {
    if (this.incident.relationships?.incident_types?.data) {
      const ids = this.incident.relationships?.incident_types?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'incident_types' && ids.includes(i.id);
      });
    } 
      return [];
    
  };
}
