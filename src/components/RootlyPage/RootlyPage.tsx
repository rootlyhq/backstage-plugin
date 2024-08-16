import React from 'react';
import { useOutlet } from 'react-router';
import { DefaultRootlyPage } from './DefaultRootlyPage';

export const RootlyPage = ({ organizationId }: { organizationId?: string }) => {
  const outlet = useOutlet();

  return outlet || <DefaultRootlyPage organizationId={organizationId} />;
};
