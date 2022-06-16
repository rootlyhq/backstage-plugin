import React from 'react';
import { useOutlet } from 'react-router';
import { DefaultRootlyPage } from './DefaultRootlyPage';

export const RootlyPage = () => {
  const outlet = useOutlet();

  return outlet || <DefaultRootlyPage />;
};
