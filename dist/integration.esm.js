const ROOTLY_ANNOTATION_SERVICE_ID = "rootly.com/service-id";
const ROOTLY_ANNOTATION_SERVICE_SLUG = "rootly.com/service-slug";
const ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT = "rootly.com/service-auto-import";
const ROOTLY_ANNOTATION_FUNCTIONALITY_ID = "rootly.com/functionality-id";
const ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG = "rootly.com/functionality-slug";
const ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT = "rootly.com/functionality-auto-import";
const ROOTLY_ANNOTATION_TEAM_ID = "rootly.com/team-id";
const ROOTLY_ANNOTATION_TEAM_SLUG = "rootly.com/team-slug";
const ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT = "rootly.com/team-auto-import";
const isRootlyAvailable = (entity) => Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_ID]) || Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_SLUG]) || Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_ID]) || Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG]) || Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_ID]) || Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_SLUG]);
const autoImportService = (entity) => Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT]);
const autoImportFunctionality = (entity) => Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT]);
const autoImportTeam = (entity) => Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT]) && Boolean(entity.metadata.annotations?.[ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT]);

export { ROOTLY_ANNOTATION_FUNCTIONALITY_AUTO_IMPORT, ROOTLY_ANNOTATION_FUNCTIONALITY_ID, ROOTLY_ANNOTATION_FUNCTIONALITY_SLUG, ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT, ROOTLY_ANNOTATION_SERVICE_ID, ROOTLY_ANNOTATION_SERVICE_SLUG, ROOTLY_ANNOTATION_TEAM_AUTO_IMPORT, ROOTLY_ANNOTATION_TEAM_ID, ROOTLY_ANNOTATION_TEAM_SLUG, autoImportFunctionality, autoImportService, autoImportTeam, isRootlyAvailable };
//# sourceMappingURL=integration.esm.js.map
