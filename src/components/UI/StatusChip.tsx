import React from 'react';
import { Chip, Tooltip, withStyles } from '@material-ui/core';

const ResolvedChip = withStyles({
  root: {
    backgroundColor: '#C5F0C0',
    color: 'black',
  },
})(Chip);
const MitigatedChip = withStyles({
  root: {
    backgroundColor: '#FBE4A0',
    color: 'black',
  },
})(Chip);
const StartedChip = withStyles({
  root: {
    backgroundColor: '#047BF8',
    color: 'white',
  },
})(Chip);

export const StatusChip = ({ status }: { status: string }) => {
  let chip = <></>;
  switch (status) {
    case 'resolved':
    case 'completed':
      chip = <ResolvedChip label={status} size="small" />;
      break;
    case 'in_progress':
    case 'mitigated':
    case 'in_progress':
    case 'verifying':
    case 'scheduled':
    case 'cancelled':
      chip = <MitigatedChip label={status} size="small" />;
      break;
    case 'started':
      chip = <StartedChip label={status} size="small" />;
      break;
    default:
      chip = <Chip label={status} size="small" />;
  }

  return (
    <Tooltip title={status}>
      <span>{chip}</span>
    </Tooltip>
  );
};
