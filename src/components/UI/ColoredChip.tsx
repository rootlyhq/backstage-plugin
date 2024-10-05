import { Chip, Tooltip } from '@material-ui/core';
import React from 'react';
import { contrastColor } from 'contrast-color';

export const ColoredChip = ({
  label,
  tooltip,
  color,
  icon,
  onClick,
}: {
  label?: string;
  tooltip?: string;
  color?: string;
  icon?: React.ReactElement;
  onClick?: () => void;
}) => {
  const backgroundColor = color || '#FFF';
  const textColor = contrastColor({ bgColor: backgroundColor });

  // Clone the icon element and apply the color logic
  const coloredIcon = icon ? React.cloneElement(icon, { style: { color: textColor } }) : undefined;

  if (label) {
    return (
      <Tooltip title={tooltip || label}>
        <Chip
          label={label}
          style={{ backgroundColor, color: textColor }}
          size="small"
          onClick={onClick}
          icon={coloredIcon}
        />
      </Tooltip>
    );
  } 
    return <Chip label="N/A" size="small" />;
  
};
