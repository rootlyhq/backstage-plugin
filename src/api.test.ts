import type { DiscoveryApi, IdentityApi } from "@backstage/core-plugin-api";
import { mockApis, renderInTestApp } from "@backstage/frontend-test-utils";
import { RootlyApi } from "@rootly/backstage-plugin-common";
import { screen } from "@testing-library/react";
import { createElement } from "react";

import {
  rootlyApiRef,
  RootlyApiImpl,
  type RootlyApiRef,
  useRootlyClient,
} from "./api";

jest.mock("@rootly/backstage-plugin-common", () => ({
  ...jest.requireActual("@rootly/backstage-plugin-common"),
  RootlyApi: jest.fn(),
}));

const MockedRootlyApi = jest.mocked(RootlyApi);
const proxyUrl = Promise.resolve("https://backstage.example/api/proxy");
const credentials = Promise.resolve({ token: "backstage-token" });

const discovery = {
  getBaseUrl: jest.fn().mockReturnValue(proxyUrl),
} as unknown as DiscoveryApi;

const identity = {
  getCredentials: jest.fn().mockReturnValue(credentials),
} as unknown as IdentityApi;

const createApi = (rootly: Record<string, Record<string, string | boolean>>) =>
  RootlyApiImpl.fromOptions({
    config: mockApis.config({ data: { rootly } }),
    discovery,
    identity,
  });

describe("RootlyApiImpl", () => {
  beforeEach(() => {
    MockedRootlyApi.mockClear();
  });

  it("creates a client from the only configured organization", () => {
    createApi({
      primary: {
        proxyPath: "/api/proxy/rootly",
        apiHost: "https://rootly.example",
      },
    }).getClient({});

    expect(MockedRootlyApi).toHaveBeenCalledWith({
      apiProxyPath: "/api/proxy/rootly",
      apiProxyUrl: proxyUrl,
      apiToken: credentials,
      apiHost: "https://rootly.example",
    });
  });

  it("uses the explicitly requested organization", () => {
    createApi({
      first: {
        proxyPath: "/api/proxy/first",
        apiHost: "https://first.rootly.example",
      },
      second: {
        proxyPath: "/api/proxy/second",
        apiHost: "https://second.rootly.example",
      },
    }).getClient({ organizationId: "second" });

    expect(MockedRootlyApi).toHaveBeenCalledWith(
      expect.objectContaining({
        apiProxyPath: "/api/proxy/second",
        apiHost: "https://second.rootly.example",
      }),
    );
  });

  it("uses the default organization when none is requested", () => {
    createApi({
      first: {
        proxyPath: "/api/proxy/first",
        apiHost: "https://first.rootly.example",
      },
      second: {
        isDefault: true,
        proxyPath: "/api/proxy/second",
        apiHost: "https://second.rootly.example",
      },
    }).getClient({});

    expect(MockedRootlyApi).toHaveBeenCalledWith(
      expect.objectContaining({
        apiProxyPath: "/api/proxy/second",
        apiHost: "https://second.rootly.example",
      }),
    );
  });

  it("falls back to the first organization when no default is configured", () => {
    createApi({
      first: {
        proxyPath: "/api/proxy/first",
        apiHost: "https://first.rootly.example",
      },
      second: {
        proxyPath: "/api/proxy/second",
        apiHost: "https://second.rootly.example",
      },
    }).getClient({});

    expect(MockedRootlyApi).toHaveBeenCalledWith(
      expect.objectContaining({
        apiProxyPath: "/api/proxy/first",
        apiHost: "https://first.rootly.example",
      }),
    );
  });

  it("passes undefined optional settings through to the common client", () => {
    createApi({ primary: {} }).getClient({});

    expect(MockedRootlyApi).toHaveBeenCalledWith({
      apiProxyPath: undefined,
      apiProxyUrl: proxyUrl,
      apiToken: credentials,
      apiHost: undefined,
    });
  });
});

describe("useRootlyClient", () => {
  it("uses an application-provided Rootly API override", async () => {
    const customClient = {} as RootlyApi;
    const getClient = jest.fn().mockReturnValue(customClient);
    const customApi: RootlyApiRef = { getClient };

    const Probe = () => {
      const client = useRootlyClient({ organizationId: "organization-id" });
      return createElement(
        "div",
        null,
        client === customClient ? "Custom client" : "Fallback client",
      );
    };

    renderInTestApp(createElement(Probe), {
      apis: [[rootlyApiRef, customApi]],
    });

    expect(await screen.findByText("Custom client")).toBeInTheDocument();
    expect(getClient).toHaveBeenCalledWith({
      organizationId: "organization-id",
    });
  });
});
