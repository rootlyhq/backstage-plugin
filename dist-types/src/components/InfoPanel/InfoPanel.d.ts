import React from 'react';
type Props = {
    title?: string;
    message?: React.ReactNode;
    children?: React.ReactNode;
};
/**
 * InfoPanel. Show a user friendly message to a user.
 *
 * @param {string} [title] A title for the info panel.
 * @param {Object} [message] Optional more detailed user-friendly message elaborating on the cause of the error.
 * @param {Object} [children] Objects to provide context, such as a stack trace or detailed error reporting.
 *  Will be available inside an unfolded accordion.
 */
export declare const InfoPanel: (props: Props) => React.JSX.Element;
export {};
