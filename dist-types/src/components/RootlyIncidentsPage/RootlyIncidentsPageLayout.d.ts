import { TabProps } from '@material-ui/core';
import { default as React } from 'react';
declare type SubRoute = {
    path: string;
    title: string;
    children: JSX.Element;
    tabProps?: TabProps<React.ElementType, {
        component?: React.ElementType;
    }>;
};
export declare const RootlyIncidentsPageLayout: {
    (): React.JSX.Element;
    Route: (props: SubRoute) => null;
};
export {};
