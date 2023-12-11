/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

import { GlobalStateContext } from 'utils/GlobalState';

import { WalletLogin } from './WalletLogin';

const loggedInSettings = [
  { label: 'Profile', url: '/user/profile' },
  { label: 'Logout', url: '/user/logout' },
];
const Wallet = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { jwt } = state.auth;
  const [enableWalletSync, setEnableWalletSync] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  useEffect(() => {
    setTimeout(() => {
      setEnableWalletSync(true);
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        state.auth.jwt = token;
        if (setState) setState(state);
      }
    }, 50);
  }, []);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (!enableWalletSync) return <></>;

  return (
    <>
      {jwt ? (
        <>
          <Tooltip title="Open profile links">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="ETH" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {loggedInSettings.map((setting) => (
              <MenuItem key={setting.label} onClick={handleCloseUserMenu}>
                <Link href={setting.url}>
                  <Typography textAlign="center">{setting.label}</Typography>
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <WalletLogin jwt={jwt} />
      )}
    </>
  );
};

export { Wallet };
