import { Chip, Tooltip } from '@material-ui/core';
import React from 'react';
import { contrastColor } from 'contrast-color';

export const ColoredChip = ({
  label,
  tooltip,
  color,
}: {
  label?: string;
  tooltip?: string;
  color?: string;
}) => {
  if (label) {
    return (
      <Tooltip title={tooltip || label}>
        <Chip
          label={label}
          style={{ backgroundColor: color || '#FFF', color: contrastColor({bgColor: (color || "#FFF")})}}
          size="small"
        />
      </Tooltip>
    );
  } 
    return <Chip label="N/A" size="small" />;
  
};
