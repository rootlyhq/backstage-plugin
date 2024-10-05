import { Tooltip, Chip } from '@material-ui/core';
import React from 'react';
import { contrastColor } from 'contrast-color';

const ColoredChip = ({
  label,
  tooltip,
  color,
  icon,
  onClick
}) => {
  const backgroundColor = color || "#FFF";
  const textColor = contrastColor({ bgColor: backgroundColor });
  const coloredIcon = icon ? React.cloneElement(icon, { style: { color: textColor } }) : void 0;
  if (label) {
    return /* @__PURE__ */ React.createElement(Tooltip, { title: tooltip || label }, /* @__PURE__ */ React.createElement(
      Chip,
      {
        label,
        style: { backgroundColor, color: textColor },
        size: "small",
        onClick,
        icon: coloredIcon
      }
    ));
  }
  return /* @__PURE__ */ React.createElement(Chip, { label: "N/A", size: "small" });
};

export { ColoredChip };
//# sourceMappingURL=ColoredChip.esm.js.map
