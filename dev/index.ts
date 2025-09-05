import ReactDOM from "react-dom/client";

import { RootlyApi } from "@rootly/backstage-plugin-common";

import { createApp } from "@backstage/frontend-defaults";
import { catalogApiRef } from "@backstage/plugin-catalog-react";
import catalogPlugin from "@backstage/plugin-catalog/alpha";
import searchPlugin from "@backstage/plugin-search/alpha";

import { rootlyApiRef } from "../src/api";
import rootlyPlugin from "../src/alpha";

import { rootlyApi } from "./rootlyApiMock";
import { catalogApi } from "./catalogApiMock";

const catalogPluginOverrides = catalogPlugin.withOverrides({
  extensions: [
    catalogPlugin.getExtension("api:catalog").override({
      params: (defineParams) =>
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
      params: (defineParams) =>
        defineParams({
          api: rootlyApiRef,
          deps: {},
          factory() {
            return rootlyApi as unknown as { getClient: () => RootlyApi };
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
