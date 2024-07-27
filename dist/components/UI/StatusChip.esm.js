import React from 'react';
import { withStyles, Chip, Tooltip } from '@material-ui/core';

const ResolvedChip = withStyles({
  root: {
    backgroundColor: "#C5F0C0",
    color: "black"
  }
})(Chip);
const MitigatedChip = withStyles({
  root: {
    backgroundColor: "#FBE4A0",
    color: "black"
  }
})(Chip);
const StartedChip = withStyles({
  root: {
    backgroundColor: "#047BF8",
    color: "white"
  }
})(Chip);
const StatusChip = ({ status }) => {
  let chip = /* @__PURE__ */ React.createElement(React.Fragment, null);
  switch (status) {
    case "resolved":
    case "completed":
      chip = /* @__PURE__ */ React.createElement(ResolvedChip, { label: status, size: "small" });
      break;
    case "mitigated":
    case "in_progress":
    case "verifying":
    case "scheduled":
    case "cancelled":
      chip = /* @__PURE__ */ React.createElement(MitigatedChip, { label: status, size: "small" });
      break;
    case "started":
      chip = /* @__PURE__ */ React.createElement(StartedChip, { label: status, size: "small" });
      break;
    default:
      chip = /* @__PURE__ */ React.createElement(Chip, { label: status, size: "small" });
  }
  return /* @__PURE__ */ React.createElement(Tooltip, { title: status }, /* @__PURE__ */ React.createElement("span", null, chip));
};

export { StatusChip };
//# sourceMappingURL=StatusChip.esm.js.map
