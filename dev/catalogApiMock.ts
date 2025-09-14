import { catalogApiMock } from "@backstage/plugin-catalog-react/testUtils";

export const catalogApi = catalogApiMock({
  entities: [
    {
      apiVersion: "backstage.io/v1alpha1",
      kind: "Component",
      metadata: {
        name: "backstage-plugin-test-service",
        description: "backstage-plugin-test-service",
        annotations: {
          "rootly.com/service-id": "<service_id>",
        },
      },
      spec: {
        type: "website",
        owner: "cubic-belugas",
        lifecycle: "experimental",
      },
    },
  ],
});
