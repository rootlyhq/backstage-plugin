import { EntityListProvider } from '@backstage/plugin-catalog-react';
import React from 'react';
import { EntitiesTable } from './EntitiesTable';

export const EntitiesList = () => {
  return (
    <EntityListProvider>
      <EntitiesTable />
    </EntityListProvider>
  );
};
