import { loadConfigSchema } from "@backstage/config-loader";
import { resolve } from "node:path";

const fullConfig = {
  rootly: {
    primary: {
      apiKey: "must-not-reach-the-browser",
      apiHost: "https://rootly.example",
      isDefault: true,
      proxyPath: "/api/proxy/rootly",
    },
  },
};

describe("Rootly configuration schema", () => {
  const schemaPromise = loadConfigSchema({
    dependencies: [],
    excludePackageDependencies: true,
    packagePaths: [resolve(process.cwd(), "package.json")],
  });

  it("marks the API key as secret and runtime settings as frontend-visible", async () => {
    const schema = await schemaPromise;
    const serialized = schema.serialize() as {
      schemas: Array<{
        value: {
          properties: {
            rootly: {
              additionalProperties: {
                properties: Record<string, { visibility?: string }>;
              };
            };
          };
        };
      }>;
    };
    const properties =
      serialized.schemas[0].value.properties.rootly.additionalProperties
        .properties;

    expect(properties.apiKey.visibility).toBe("secret");
    expect(properties.apiHost.visibility).toBe("frontend");
    expect(properties.isDefault.visibility).toBe("frontend");
    expect(properties.proxyPath.visibility).toBe("frontend");
  });

  it("removes API keys from frontend configuration", async () => {
    const schema = await schemaPromise;

    expect(
      schema.process([{ context: "test", data: fullConfig }], {
        visibility: ["frontend"],
      }),
    ).toEqual([
      {
        context: "test",
        data: {
          rootly: {
            primary: {
              apiHost: "https://rootly.example",
              isDefault: true,
              proxyPath: "/api/proxy/rootly",
            },
          },
        },
      },
    ]);
  });

  it("accepts proxy configuration without the deprecated API key", async () => {
    const schema = await schemaPromise;
    const proxyOnlyConfig = {
      rootly: {
        primary: {
          proxyPath: "/api/proxy/rootly",
        },
      },
    };

    expect(
      schema.process([{ context: "test", data: proxyOnlyConfig }]),
    ).toEqual([{ context: "test", data: proxyOnlyConfig }]);
  });
});
