import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React from 'react';

import {
  RootlyApi,
  RootlyFunctionality,
} from '@rootly/backstage-plugin-common';

export const FunctionalityActionsMenu = ({ functionality }: { functionality: RootlyFunctionality }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`actions-menu-${functionality.id}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: { maxHeight: 48 * 4.5 },
        }}
      >
        <MenuItem key="details" onClick={handleCloseMenu}>
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            <Link target="blank" href={RootlyApi.getFunctionalityDetailsURL(functionality)}>
              View in Rootly
            </Link>
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
