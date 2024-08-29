import { ConfigApi, IdentityApi, DiscoveryApi } from '@backstage/core-plugin-api';
import { RootlyApi } from '@rootly/backstage-plugin-common';
export declare const useRootlyClient: ({ config, discovery, identify, organizationId }: {
    config: ConfigApi;
    discovery: DiscoveryApi;
    identify: IdentityApi;
    organizationId?: string;
}) => RootlyApi;
