import {
  configApiRef,
  discoveryApiRef,
  identityApiRef,
} from "@backstage/core-plugin-api";
import { ApiBlueprint } from "@backstage/frontend-plugin-api";
import { rootlyApiRef, RootlyApiImpl } from "../api";

export const rootlyApi = ApiBlueprint.make({
  params: (defineParams) =>
    defineParams({
      api: rootlyApiRef,
      deps: {
        config: configApiRef,
        discovery: discoveryApiRef,
        identity: identityApiRef,
      },
      factory({ config, discovery, identity }) {
        return RootlyApiImpl.fromOptions({ config, discovery, identity });
      },
    }),
});
