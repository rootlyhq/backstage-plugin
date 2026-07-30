import ReactDOM from "react-dom/client";

import { createApp } from "@backstage/frontend-defaults";
import type {
  AnyApiFactory,
  ApiFactory,
  ExtensionBlueprintParams,
} from "@backstage/frontend-plugin-api";
import { catalogApiRef } from "@backstage/plugin-catalog-react";
import catalogPlugin from "@backstage/plugin-catalog/alpha";
import searchPlugin from "@backstage/plugin-search/alpha";

import { RootlyApiRef, rootlyApiRef } from "../src/api";
import rootlyPlugin from "../src/alpha";

import { rootlyApi } from "./rootlyApiMock";
import { catalogApi } from "./catalogApiMock";

type DefineApiParams = <
  TApi,
  TImpl extends TApi,
  TDeps extends Record<string, unknown>,
>(
  params: ApiFactory<TApi, TImpl, TDeps>,
) => ExtensionBlueprintParams<AnyApiFactory>;

const catalogPluginOverrides = catalogPlugin.withOverrides({
  extensions: [
    catalogPlugin.getExtension("api:catalog").override({
      params: (defineParams: DefineApiParams) =>
        defineParams({
          api: catalogApiRef,
          deps: {},
          factory: () => catalogApi,
        }),
    }),
  ],
});

const rootlyPluginOverrides = rootlyPlugin.withOverrides({
  extensions: [
    rootlyPlugin.getExtension("api:rootly").override({
      params: (defineParams: DefineApiParams) =>
        defineParams({
          api: rootlyApiRef,
          deps: {},
          factory() {
            return rootlyApi as unknown as RootlyApiRef;
          },
        }),
    }),
  ],
});

const app = createApp({
  features: [searchPlugin, catalogPluginOverrides, rootlyPluginOverrides],
});

const root = app.createRoot();

ReactDOM.createRoot(document.getElementById("root")!).render(root);
