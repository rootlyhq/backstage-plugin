/// <reference types="react" />
import { Incident } from '../../types';
export declare const IncidentActionsMenu: ({
  incident,
}: {
  incident: Incident;
  onIncidentChanged?: ((incident: Incident) => void) | undefined;
}) => JSX.Element;
