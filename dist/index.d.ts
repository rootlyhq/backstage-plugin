/// <reference types="react" />
import * as React from 'react';
import React__default from 'react';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { RootlyIncidentsFetchOpts, RootlyServicesFetchOpts, RootlyFunctionalitiesFetchOpts, RootlyTeamsFetchOpts } from '@rootly/backstage-plugin-common';

declare const RootlyPage: () => React.JSX.Element;
declare const RootlyOverviewCard: () => React.JSX.Element;
declare const RootlyIncidentsPage: () => React.JSX.Element;

declare const RootlyPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    explore: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}, {}>;

declare const isRootlyAvailable: (entity: Entity) => boolean;

declare const IncidentsTable: ({ params }: {
    params?: RootlyIncidentsFetchOpts | undefined;
}) => React__default.JSX.Element;

declare const ServicesTable: ({ params }: {
    params?: RootlyServicesFetchOpts | undefined;
}) => React__default.JSX.Element;

declare const FunctionalitiesTable: ({ params }: {
    params?: RootlyFunctionalitiesFetchOpts | undefined;
}) => React__default.JSX.Element;

declare const TeamsTable: ({ params }: {
    params?: RootlyTeamsFetchOpts | undefined;
}) => React__default.JSX.Element;

export { FunctionalitiesTable, IncidentsTable, RootlyIncidentsPage, RootlyOverviewCard, RootlyPage, RootlyPlugin, ServicesTable, TeamsTable, isRootlyAvailable };
