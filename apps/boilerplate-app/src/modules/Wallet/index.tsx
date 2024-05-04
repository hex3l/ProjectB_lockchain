/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import styled from '@emotion/styled';
import { Avatar, Badge, Button, CircularProgress, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { InjectedConnector } from '@wagmi/core';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';

import { ServiceBayLogo } from 'modules/ServiceBayLogo';
import { GlobalStateContext } from 'utils/GlobalState';

import { WalletLogin } from './WalletLogin';

const loggedInSettings = [
  { label: 'Profile', url: '/user/profile' },
  { label: 'Logout', url: '/user/logout' },
];
const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px #44b700`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid #44b700',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
const Wallet = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { jwt } = state.auth;
  const [enableWalletSync, setEnableWalletSync] = useState(false);
  const [avatarColor, setAvatarColor] = useState('#000');
  const { address, status } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setAvatarColor(randomColor);
      }, 50);
    }
  }, []);

  // ///////////////////////////////////////////////////////////////
  // Handle connection logic when a token exists and retries until it can connect with metamask
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && ['disconnected', 'disconnecting'].includes(status)) {
        connect();
      }
      if (!state.auth.jwt) {
        state.auth.jwt = token;
        if (setState) setState(state);
        setEnableWalletSync(true);
      }
    }
  }, [status]);
  // ///////////////////////////////////////////////////////////////

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (!enableWalletSync) return <></>;

  return (
    <>
      {jwt ? (
        <>
          <Tooltip title="Open profile links">
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
                className="text-[13px] p-1 flex flex-row"
              >
                <>
                  {status !== 'connected' ? (
                    <CircularProgress color="secondary" className="h-8 w-8" />
                  ) : (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      className="mr-1"
                    >
                      <Avatar
                        alt={`Wallet connected with address: ${address}`}
                        className="h-8 w-8"
                        sx={{ backgroundColor: avatarColor }}
                      >
                        <ServiceBayLogo sx={{ height: '70%', width: '70%' }} />
                      </Avatar>
                    </StyledBadge>
                  )}
                  {address ? `${address.substring(0, 5)}...${address.substring(35, address.length)}` : ''}
                </>
              </Button>
            </>
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
                  <Typography textAlign="center" className="no-underline text-white hover:no-underline">
                    {setting.label}
                  </Typography>
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
