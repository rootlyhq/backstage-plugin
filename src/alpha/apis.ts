import {
  configApiRef,
  discoveryApiRef,
  identityApiRef,
} from "@backstage/core-plugin-api";
import { ApiBlueprint } from "@backstage/frontend-plugin-api";
import { RootlyApi } from "@rootly/backstage-plugin-common";
import { rootlyApiRef } from "../api";

export const rootlyApi = ApiBlueprint.make({
  params: (defineParams) =>
    defineParams({
      api: rootlyApiRef,
      deps: {
        config: configApiRef,
        discovery: discoveryApiRef,
        identify: identityApiRef,
      },
      factory({ config, discovery, identify }) {
        return {
          getClient: ({ organizationId }: { organizationId?: string }) => {
            const configKeys = config.getConfig("rootly").keys();

            let apiProxyPath = config.getOptionalString(
              `rootly.${configKeys.at(0)}.proxyPath`
            );

            if (organizationId) {
              apiProxyPath = config.getOptionalString(
                `rootly.${organizationId}.proxyPath`
              );
            } else if (configKeys.length > 1) {
              let defaultOrgId = config.getConfig("rootly").keys().at(0);
              for (const orgId of config.getConfig("rootly").keys()) {
                if (config.getOptionalBoolean(`rootly.${orgId}.isDefault`)) {
                  defaultOrgId = orgId;
                  break;
                }
              }
              apiProxyPath = config.getOptionalString(
                `rootly.${defaultOrgId}.proxyPath`
              );
            }

            return new RootlyApi({
              apiProxyUrl: discovery.getBaseUrl("proxy"),
              apiProxyPath: apiProxyPath,
              apiToken: identify.getCredentials(),
            });
          },
        };
      },
    }),
});
