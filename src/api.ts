import {
  createApiRef,
  ConfigApi,
  configApiRef,
  IdentityApi,
  identityApiRef,
  DiscoveryApi,
  discoveryApiRef,
  useApi,
  useApiHolder,
} from "@backstage/core-plugin-api";
import { RootlyApi } from "@rootly/backstage-plugin-common";

type RootlyClientOptions = {
  organizationId?: string;
}

export type RootlyApiRef = {
  getClient(options: RootlyClientOptions): RootlyApi;
}

export const rootlyApiRef = createApiRef<RootlyApiRef>({
  id: "rootly",
});

type RootlyApiOptions = {
  config: ConfigApi;
  identity: IdentityApi;
  discovery: DiscoveryApi;
};

export class RootlyApiImpl implements RootlyApiRef {
  #config: ConfigApi;
  #identity: IdentityApi;
  #discovery: DiscoveryApi;

  private constructor(options: RootlyApiOptions) {
    const { config, discovery, identity } = options;
    this.#config = config;
    this.#discovery = discovery;
    this.#identity = identity;
  }

  static fromOptions(options: RootlyApiOptions) {
    return new RootlyApiImpl(options);
  }

  getClient(options: RootlyClientOptions) {
    const { organizationId } = options;

    const configKeys = this.#config.getConfig("rootly").keys();

    let apiProxyPath = this.#config.getOptionalString(
      `rootly.${configKeys.at(0)}.proxyPath`
    );

    if (organizationId) {
      apiProxyPath = this.#config.getOptionalString(
        `rootly.${organizationId}.proxyPath`
      );
    } else if (configKeys.length > 1) {
      let defaultOrgId = this.#config.getConfig("rootly").keys().at(0);
      for (const orgId of this.#config.getConfig("rootly").keys()) {
        if (this.#config.getOptionalBoolean(`rootly.${orgId}.isDefault`)) {
          defaultOrgId = orgId;
          break;
        }
      }
      apiProxyPath = this.#config.getOptionalString(
        `rootly.${defaultOrgId}.proxyPath`
      );
    }

    return new RootlyApi({
      apiProxyPath,
      apiProxyUrl: this.#discovery.getBaseUrl("proxy"),
      apiToken: this.#identity.getCredentials(),
    });
  }
}

export const useRootlyClient = ({
  organizationId,
}: {
  organizationId?: string;
}) => {
  const config = useApi(configApiRef);
  const identity = useApi(identityApiRef);
  const discovery = useApi(discoveryApiRef);
  const apis = useApiHolder();
  const rootlyApi = apis.get(rootlyApiRef) || RootlyApiImpl.fromOptions({ config, identity, discovery });
    return rootlyApi.getClient({ organizationId });
};
