import { Chip } from '@material-ui/core';
import React from 'react';
import { ColoredChip } from './ColoredChip.esm.js';

const ColoredChips = ({
  objects
}) => {
  if (objects?.length > 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, objects.map((r) => {
      return /* @__PURE__ */ React.createElement(
        ColoredChip,
        {
          key: Math.random().toString(36),
          label: r.attributes.name,
          tooltip: r.attributes.description,
          color: r.attributes.color
        }
      );
    }));
  }
  return /* @__PURE__ */ React.createElement(Chip, { label: "N/A", size: "small" });
};

export { ColoredChips };
//# sourceMappingURL=ColoredChips.esm.js.map
