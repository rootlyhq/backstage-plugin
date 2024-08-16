import { ConfigApi, DiscoveryApi } from '@backstage/core-plugin-api';
import { RootlyApi } from 'rootly-backstage-plugin-common';
export declare const RootlyApiRef: import("@backstage/core-plugin-api").ApiRef<RootlyApi>;
export declare const useRootlyClient: ({ discovery, config, organizationId }: {
    discovery: DiscoveryApi;
    config: ConfigApi;
    organizationId?: string;
}) => RootlyApi;
