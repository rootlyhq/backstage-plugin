import {
    createApiRef,
    ConfigApi,
    DiscoveryApi,
  } from '@backstage/core-plugin-api';
import { RootlyApi } from '@rootly/backstage-plugin-common';

export const RootlyApiRef = createApiRef<RootlyApi>({
    id: 'plugin.rootly.service',
  });

export const useRootlyClient = ({ discovery, config, organizationId }: { discovery: DiscoveryApi, config: ConfigApi, organizationId?: string }) => {
  const configKeys = config.getConfig('rootly').keys();

  let token = config.getOptionalString(`rootly.${configKeys.at(0)}.apiKey`);

  if (organizationId) {
    token = config.getOptionalString(`rootly.${organizationId}.apiKey`)
  } else if (configKeys.length > 1) {
    let defaultOrgId = config.getConfig('rootly').keys().at(0)
    for (const orgId of config.getConfig('rootly').keys()) {
      if (config.getOptionalBoolean(`rootly.${orgId}.isDefault`)) {
        defaultOrgId = orgId
        break;
      }
    }
    token = config.getOptionalString(`rootly.${defaultOrgId}.apiKey`)
  }

  const client = new RootlyApi({
    apiProxyPath: discovery.getBaseUrl('proxy'),
    apiToken: new Promise((resolve) => { resolve({token: token}) }),
  });
  return client;
}