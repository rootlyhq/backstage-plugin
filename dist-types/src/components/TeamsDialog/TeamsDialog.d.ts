import React from 'react';
import { Entity } from '../../types';
export declare const TeamsDialog: ({ open, entity, handleClose, handleImport, handleUpdate, }: {
    open: boolean;
    entity: Entity;
    handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
    handleImport: Function;
    handleUpdate: Function;
}) => React.JSX.Element;
