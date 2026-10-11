# @rootly/backstage-plugin

## 1.4.0

- Add status, severity, team, service and environment filters to incidents tables, applied by the Rootly API across all pages (#47)
- Sort incidents server-side on Started At, Mitigated At and Resolved At so the order spans every page (#48)
- Hide test incidents by default, with a per-organization `showTestIncidents` config option and a "Show test incidents" toggle (#49)
- Fix functionality and system incident tables sending unsupported `functionalitys` / `groups` filters
- Fetch fresh Backstage credentials for every Rootly API request so long-lived pages keep working after the Backstage token expires (requires `@rootly/backstage-plugin-common` 1.6.0)
- Upgrade to Backstage 1.55.3 (`@backstage/cli` 0.36.6) and refresh the Backstage dependency tree
- Align peer dependencies with Backstage: `react`/`react-dom` `^17.0.0 || ^18.0.0`, `react-router`/`react-router-dom` `^6.30.2`
- Move build tooling (`@backstage/cli`, `prettier`) out of runtime `dependencies`; use the Backstage Prettier config
- Remove unused dependencies (`history`, `qs`, `install`, `concurrently`, `@spotify/prettier-config`, `swr`, `cross-fetch`, `@types/dom-to-image`)
- Use the TypeScript 5.8 line supported by the Backstage CLI and `@types/node` 24
- Move the toolchain to Node.js 24 and Yarn 4.13.0
- Update pinned GitHub Actions, tighten workflow permissions, and ignore Dependabot majors Backstage cannot adopt

## 1.3.3

- Stabilize Rootly client identity to prevent repeated entity requests and render loops
- Add Playwright browser coverage for Rootly routes, resources, and catalog integration
- Run end-to-end tests on Blacksmith and retain Playwright reports
- Align the development app with the React 18 and React Router 6 Backstage runtime

## 1.3.2

- Allow the documented proxy-only Rootly configuration to pass strict validation
- Keep the legacy `apiKey` setting optional and secret so it is not exposed to the frontend
- Refresh minor and patch development dependencies

## 1.3.1

- Refresh vulnerable transitive dependencies and development tooling
- Upgrade Jest DOM and fetch mocking dependencies with compatibility fixes
- Preserve React Router 7 and supported Backstage peer ranges
- Migrate navigation metadata to the current Backstage frontend API

## 1.3.0

- Add catalog entity support
- New `RootlyOverviewCatalogEntityCard` component for entity detail pages
- New `CatalogEntitiesTable` with catalog selector dropdown, search, and pagination
- Add "Catalog" tab to the main Rootly page
- Add "Rootly Catalog Entity" column to the Entities table
- Extend `isRootlyAvailable` to detect catalog entity annotations
- URL helpers now instance methods with configurable `apiHost` (defaults to `https://rootly.com`)
- New `apiHost` config option under `rootly.{orgId}.apiHost`
- Add `apiHost` and `proxyPath` to config schema


## 1.2.2

- Update react-dom peer dependency to support React 18

## 1.2.1

- Fix package.json metadata for Backstage compliance
- Convert pluginPackages from string to array format
- Add repository directory field

## 1.2.0

- Pin Backstage dependencies to specific versions
- Upgrade @testing-library/react from 14.3.1 to 15.0.7

## 1.1.0

- Upgrade Backstage CLI and dependencies
- Update README.md documentation

## 1.0.0

- Added support for Functionalities & Teams
- Adding a CatalogProcessor to sync entities in the background with Rootly (Backstage being the source of truth)
- Syncing `pagerduty.com/service-id:[SERVICE-ID]` annotation for a given entity to Rootly
- Adding support for Rootly Multi Organizations
- New Frontend System Migration
- Deprecated importing services from GUI. Only annotations are supported

## 1.0.0-beta.14

- Upgrade dependencies

## 1.0.0-beta.13

- Improve ColoredChips Performance
- Optimize DefaultRootlyIncidentsPage getEntityByRef calls

## 1.0.0-beta.12

- Handle parseEntityRef exception

## 1.0.0-beta.11

- Fix rootlyClient OrgID for RootlySystemIncidentsPageLayout

## 1.0.0-beta.10

- Minor improvements

## 1.0.0-beta.9

- Add RootlySystemIncidentsPageLayout component

## 1.0.0-beta.8

- Support System Page

## 1.0.0-beta.7

- Add RootlyFunctionalityIncidentsPageLayout component
- Add RootlyTeamIncidentsPageLayout component

## 1.0.0-beta.6

- Add search capabilities
- Clickable Chip component

## 1.0.0-beta.5

- Minor improvements

## 1.0.0-beta.3

- Bug fixes and improvements

## 1.0.0-beta.2

- Bug fixes and improvements

## 1.0.0-beta

- Add multi account support
- Upgrade to new plugin architecture

## 0.3.9

- Upgrade dependencies

## 0.3.8

- Upgrade dependencies

## 0.3.7

- Dependency updates

## 0.3.6

- Minor improvements

## 0.3.5

- Pluralize "View all Incidents"

## 0.3.4

- Remove console.log statements

## 0.3.3

- Fix getCreateIncidentURL

## 0.3.2

- Support annotations

## 0.3.1

- Move react-router to peerDependencies

## 0.3.0

- Major improvements and features

## 0.2.0

- Add dist/index.d.ts

## 0.1.9

- Include dist-types in package

## 0.1.8

- Set incidents as first tab
- Add dist-types
- Add isRootlyAvailable helper
- Add ROOTLY_ANNOTATION_APP_NAME constant

## 0.1.7

- Bug fixes

## 0.1.6

- Bug fixes

## 0.1.2

- Fix domain configuration

## 0.1.1

- Fix duplicate case

## 0.1.0

- Initial release
