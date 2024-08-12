import { Chip } from '@material-ui/core';
import React from 'react';
import {
  RootlyEnvironment,
  RootlyFunctionality,
  RootlyTeam,
  RootlyIncidentType,
  RootlyService,
} from '@rootly/backstage-plugin-common';
import { ColoredChip } from './ColoredChip';

export const ColoredChips = ({
  objects,
}: {
  objects:
    | RootlyService[]
    | RootlyFunctionality[]
    | RootlyEnvironment[]
    | RootlyIncidentType[]
    | RootlyTeam[];
}) => {
  if (objects?.length > 0) {
    return (
      <>
        {objects.map(r => {
          return (
            <ColoredChip
              key={Math.random().toString(36)}
              label={r.attributes.name}
              tooltip={r.attributes.description}
              color={r.attributes.color}
            />
          );
        })}
      </>
    );
  }
  return <Chip label="N/A" size="small" />;
};
