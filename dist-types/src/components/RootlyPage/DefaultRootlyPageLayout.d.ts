import { TabProps } from '@material-ui/core';
import { default as React } from 'react';
type SubRoute = {
    path: string;
    title: string;
    children: React.ReactElement;
    tabProps?: TabProps<React.ElementType, {
        component?: React.ElementType;
    }>;
};
type LayoutProps = {
    children?: React.ReactNode;
};
export declare const DefaultRootlyPageLayout: {
    ({ children }: LayoutProps): React.JSX.Element;
    Route: (props: SubRoute) => null;
};
export {};
