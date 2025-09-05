import { createApiRef, useApi } from "@backstage/core-plugin-api";
import { RootlyApi } from "@rootly/backstage-plugin-common";

export const rootlyApiRef = createApiRef<{
  getClient: ({ organizationId }: { organizationId?: string }) => RootlyApi;
}>({
  id: "rootly",
});

export const useRootlyClient = ({
  organizationId,
}: {
  organizationId?: string;
}) => {
  return useApi(rootlyApiRef).getClient({ organizationId });
};
