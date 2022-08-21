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
declare type LayoutProps = {
    children?: React.ReactNode;
};
export declare const DefaultRootlyPageLayout: {
    ({ children }: LayoutProps): JSX.Element;
    Route: (props: SubRoute) => null;
};
export {};
