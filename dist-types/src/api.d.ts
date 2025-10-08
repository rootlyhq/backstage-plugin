import { ConfigApi, IdentityApi, DiscoveryApi } from "@backstage/core-plugin-api";
import { RootlyApi } from "@rootly/backstage-plugin-common";
type RootlyClientOptions = {
    organizationId?: string;
};
export type RootlyApiRef = {
    getClient(options: RootlyClientOptions): RootlyApi;
};
export declare const rootlyApiRef: import("@backstage/core-plugin-api").ApiRef<RootlyApiRef>;
type RootlyApiOptions = {
    config: ConfigApi;
    identity: IdentityApi;
    discovery: DiscoveryApi;
};
export declare class RootlyApiImpl implements RootlyApiRef {
    #private;
    private constructor();
    static fromOptions(options: RootlyApiOptions): RootlyApiImpl;
    getClient(options: RootlyClientOptions): RootlyApi;
}
export declare const useRootlyClient: ({ organizationId, }: {
    organizationId?: string;
}) => RootlyApi;
export {};
