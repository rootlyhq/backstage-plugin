import React from 'react';
import { useOutlet } from 'react-router';
import { DefaultRootlyIncidentsPage } from './DefaultRootlyIncidentsPage';

export const RootlyIncidentsPage = ({ organizationId }: { organizationId?: string }) => {
  const outlet = useOutlet();

  return outlet || <DefaultRootlyIncidentsPage organizationId={organizationId} />;
};
