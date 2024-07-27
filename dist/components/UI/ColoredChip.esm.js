import { Tooltip, Chip } from '@material-ui/core';
import React from 'react';
import { contrastColor } from 'contrast-color';

const ColoredChip = ({
  label,
  tooltip,
  color
}) => {
  if (label) {
    return /* @__PURE__ */ React.createElement(Tooltip, { title: tooltip || label }, /* @__PURE__ */ React.createElement(
      Chip,
      {
        label,
        style: { backgroundColor: color || "#FFF", color: contrastColor({ bgColor: color || "#FFF" }) },
        size: "small"
      }
    ));
  }
  return /* @__PURE__ */ React.createElement(Chip, { label: "N/A", size: "small" });
};

export { ColoredChip };
//# sourceMappingURL=ColoredChip.esm.js.map
