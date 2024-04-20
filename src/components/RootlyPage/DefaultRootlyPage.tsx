import React from 'react';
import { EntitiesList } from '../EntitiesTable';
import { IncidentsTable } from '../IncidentsTable';
import { ServicesTable } from '../ServicesTable';
import { FunctionalitiesTable } from '../FunctionalitiesTable';
import { DefaultRootlyPageLayout } from './DefaultRootlyPageLayout';

export const DefaultRootlyPage = () => {
  return (
    <DefaultRootlyPageLayout>
      <DefaultRootlyPageLayout.Route path="incidents" title="Incidents">
        <IncidentsTable
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
        <ServicesTable />
      </DefaultRootlyPageLayout.Route>
      <DefaultRootlyPageLayout.Route path="functionalities" title="Functionalities">
        <FunctionalitiesTable />
      </DefaultRootlyPageLayout.Route>
    </DefaultRootlyPageLayout>
  );
};
