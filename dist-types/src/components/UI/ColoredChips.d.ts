import React from 'react';
import { Environment, Functionality, Team, IncidentType, Service } from '../../types';
export declare const ColoredChips: ({ objects, }: {
    objects: Service[] | Functionality[] | Environment[] | IncidentType[] | Team[];
}) => React.JSX.Element;
