/// <reference types="react" />
import { Entity } from '../../types';
export declare const ServicesDialog: ({ open, entity, handleClose, handleImport, handleUpdate, }: {
    open: boolean;
    entity: Entity;
    handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
    handleImport: Function;
    handleUpdate: Function;
}) => JSX.Element;
