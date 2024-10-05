import { Chip, Tooltip } from '@material-ui/core';
import React from 'react';
import { contrastColor } from 'contrast-color';

export const ColoredChip = ({
  label,
  tooltip,
  color,
  onClick,
}: {
  label?: string;
  tooltip?: string;
  color?: string;
  onClick?: () => void;
}) => {
  if (label) {
    return (
      <Tooltip title={tooltip || label}>
        <Chip
          label={label}
          style={{ backgroundColor: color || '#FFF', color: contrastColor({bgColor: (color || "#FFF")})}}
          size="small"
          onClick={onClick}
        />
      </Tooltip>
    );
  } 
    return <Chip label="N/A" size="small" />;
  
};
