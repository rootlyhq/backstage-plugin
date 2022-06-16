import { Chip, Tooltip } from '@material-ui/core';
import React from 'react';

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
          style={{ backgroundColor: color || '#FFF' }}
          size="small"
        />
      </Tooltip>
    );
  } else {
    return <Chip label="N/A" size="small" />;
  }
};
