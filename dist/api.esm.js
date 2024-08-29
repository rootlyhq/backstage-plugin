import { RootlyApi } from '@rootly/backstage-plugin-common';

const useRootlyClient = ({ config, discovery, identify, organizationId }) => {
  const configKeys = config.getConfig("rootly").keys();
  let apiProxyPath = config.getOptionalString(`rootly.${configKeys.at(0)}.proxyPath`);
  if (organizationId) {
    apiProxyPath = config.getOptionalString(`rootly.${organizationId}.proxyPath`);
  } else if (configKeys.length > 1) {
    let defaultOrgId = config.getConfig("rootly").keys().at(0);
    for (const orgId of config.getConfig("rootly").keys()) {
      if (config.getOptionalBoolean(`rootly.${orgId}.isDefault`)) {
        defaultOrgId = orgId;
        break;
      }
    }
    apiProxyPath = config.getOptionalString(`rootly.${defaultOrgId}.proxyPath`);
  }
  const client = new RootlyApi({
    apiProxyUrl: discovery.getBaseUrl("proxy"),
    apiProxyPath,
    apiToken: identify.getCredentials()
  });
  return client;
};

export { useRootlyClient };
//# sourceMappingURL=api.esm.js.map
