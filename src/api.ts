import {
    createApiRef,
  } from '@backstage/core-plugin-api';
import { RootlyApi } from 'rootly-backstage-plugin-common';

export const RootlyApiRef = createApiRef<RootlyApi>({
    id: 'plugin.rootly.service',
  });