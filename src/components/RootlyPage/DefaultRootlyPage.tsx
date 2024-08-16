import React from 'react';
import { EntitiesList } from '../EntitiesTable';
import { IncidentsTable } from '../IncidentsTable';
import { ServicesTable } from '../ServicesTable';
import { FunctionalitiesTable } from '../FunctionalitiesTable';
import { TeamsTable } from '../TeamsTable';
import { DefaultRootlyPageLayout } from './DefaultRootlyPageLayout';

export const DefaultRootlyPage = ({ organizationId }: { organizationId?: string }) => {
  return (
    <DefaultRootlyPageLayout>
      <DefaultRootlyPageLayout.Route path="incidents" title="Incidents">
        <IncidentsTable
          organizationId={organizationId}
          params={{
            include:
              'environments,services,functionalities,groups,incident_types',
          }}
        />
      </DefaultRootlyPageLayout.Route>
      <DefaultRootlyPageLayout.Route path="entities" title="Entities">
        <EntitiesList />
      </DefaultRootlyPageLayout.Route>
      <DefaultRootlyPageLayout.Route path="services" title="Services">
        <ServicesTable organizationId={organizationId} />
      </DefaultRootlyPageLayout.Route>
      <DefaultRootlyPageLayout.Route path="functionalities" title="Functionalities">
        <FunctionalitiesTable organizationId={organizationId} />
      </DefaultRootlyPageLayout.Route>
      <DefaultRootlyPageLayout.Route path="teams" title="Teams">
        <TeamsTable organizationId={organizationId} />
      </DefaultRootlyPageLayout.Route>
    </DefaultRootlyPageLayout>
  );
};
