import React from 'react';
import { RootlyEntity } from '@rootly/backstage-plugin-common';
export declare const FunctionalitiesDialog: ({ open, entity, handleClose, handleImport, handleUpdate, }: {
    open: boolean;
    entity: RootlyEntity;
    handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
    handleImport: Function;
    handleUpdate: Function;
}) => React.JSX.Element;
