import {
  Environment,
  Functionality,
  Team,
  Incident,
  IncidentType,
  Service,
} from '../../types';

export class IncidentWrapper {
  incident: Incident;
  included: any;
  constructor(incident: Incident, included: any) {
    this.incident = incident;
    this.included = included;
  }

  environments = (): Environment[] => {
    if (this.incident.relationships?.environments?.data) {
      const ids = this.incident.relationships?.environments?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'environments' && ids.includes(i.id);
      });
    } else {
      return [];
    }
  };

  services = (): Service[] => {
    if (this.incident.relationships?.services?.data) {
      const ids = this.incident.relationships?.services?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'services' && ids.includes(i.id);
      });
    } else {
      return [];
    }
  };

  functionalities = (): Functionality[] => {
    if (this.incident.relationships?.functionalities?.data) {
      const ids = this.incident.relationships?.functionalities?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'functionalities' && ids.includes(i.id);
      });
    } else {
      return [];
    }
  };

  groups = (): Team[] => {
    if (this.incident.relationships?.groups?.data) {
      const ids = this.incident.relationships?.groups?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'groups' && ids.includes(i.id);
      });
    } else {
      return [];
    }
  };

  types = (): IncidentType[] => {
    if (this.incident.relationships?.incident_types?.data) {
      const ids = this.incident.relationships?.incident_types?.data.map(r => {
        return r.id;
      });
      return this.included?.filter((i: { type: string; id: string }) => {
        return i.type === 'incident_types' && ids.includes(i.id);
      });
    } else {
      return [];
    }
  };
}
