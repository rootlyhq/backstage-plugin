import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare const rootlyPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const RootlyPage: () => JSX.Element;

export { RootlyPage, rootlyPlugin };
