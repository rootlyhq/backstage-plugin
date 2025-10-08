import * as react from 'react';
import react__default from 'react';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { RootlyIncidentsFetchOpts, RootlyServicesFetchOpts, RootlyFunctionalitiesFetchOpts, RootlyTeamsFetchOpts } from '@rootly/backstage-plugin-common';

declare const RootlyPage: ({ organizationId }: {
    organizationId?: string;
}) => react.JSX.Element;
declare const RootlyOverviewCard: () => react.JSX.Element;
declare const RootlyIncidentsPage: ({ organizationId }: {
    organizationId?: string;
}) => react.JSX.Element;

declare const RootlyPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    explore: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}, {}>;

declare const isRootlyAvailable: (entity: Entity) => boolean;

declare const IncidentsTable: ({ organizationId, params, }: {
    organizationId?: string;
    params?: RootlyIncidentsFetchOpts;
}) => react__default.JSX.Element;

declare const ServicesTable: ({ organizationId, params, }: {
    organizationId?: string;
    params?: RootlyServicesFetchOpts;
}) => react__default.JSX.Element;

declare const FunctionalitiesTable: ({ organizationId, params, }: {
    organizationId?: string;
    params?: RootlyFunctionalitiesFetchOpts;
}) => react__default.JSX.Element;

declare const TeamsTable: ({ organizationId, params, }: {
    organizationId?: string;
    params?: RootlyTeamsFetchOpts;
}) => react__default.JSX.Element;

export { FunctionalitiesTable, IncidentsTable, RootlyIncidentsPage, RootlyOverviewCard, RootlyPage, RootlyPlugin, ServicesTable, TeamsTable, isRootlyAvailable };
