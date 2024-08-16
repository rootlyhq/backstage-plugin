import React from 'react';
import { RootlyIncidentsPageLayout } from './RootlyIncidentsPageLayout';

export const DefaultRootlyIncidentsPage = ({ organizationId }: { organizationId?: string }) => {
  return <RootlyIncidentsPageLayout organizationId={organizationId} />;
};
