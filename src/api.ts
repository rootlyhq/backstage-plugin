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
import { useMemo } from "react";

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

/**
 * Resolves which `rootly.<key>` config block applies: the explicitly requested
 * organization, otherwise the one flagged `isDefault`, otherwise the first one.
 */
export const resolveRootlyOrganizationKey = (
  config: ConfigApi,
  organizationId?: string,
): string | undefined => {
  if (organizationId) {
    return organizationId;
  }
  const keys = config.getOptionalConfig("rootly")?.keys() ?? [];
  return (
    keys.find(key => config.getOptionalBoolean(`rootly.${key}.isDefault`)) ??
    keys.at(0)
  );
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

    const orgKey = resolveRootlyOrganizationKey(this.#config, organizationId);
    const apiHost = orgKey
      ? this.#config.getOptionalString(`rootly.${orgKey}.apiHost`)
      : undefined;

    return new RootlyApi({
      apiProxyPath,
      apiProxyUrl: this.#discovery.getBaseUrl("proxy"),
      // Fetch fresh credentials per request so long-lived pages survive token expiry.
      apiToken: () => this.#identity.getCredentials(),
      apiHost,
    });
  }
}

export type RootlyInstanceSettings = {
  /** Whether test incidents (kind `test` / `test_sub`) are listed by default. */
  showTestIncidents: boolean;
};

/** Reads per-instance frontend settings from `rootly.<key>` in app-config. */
export const useRootlyInstanceSettings = ({
  organizationId,
}: {
  organizationId?: string;
}): RootlyInstanceSettings => {
  const config = useApi(configApiRef);
  return useMemo(() => {
    const key = resolveRootlyOrganizationKey(config, organizationId);
    return {
      showTestIncidents: key
        ? config.getOptionalBoolean(`rootly.${key}.showTestIncidents`) ?? false
        : false,
    };
  }, [config, organizationId]);
};

export const useRootlyClient = ({
  organizationId,
}: {
  organizationId?: string;
}) => {
  const config = useApi(configApiRef);
  const identity = useApi(identityApiRef);
  const discovery = useApi(discoveryApiRef);
  const apis = useApiHolder();
  const rootlyApi = useMemo(
    () =>
      apis.get(rootlyApiRef) ||
      RootlyApiImpl.fromOptions({ config, identity, discovery }),
    [apis, config, identity, discovery],
  );

  return useMemo(
    () => rootlyApi.getClient({ organizationId }),
    [rootlyApi, organizationId],
  );
};
