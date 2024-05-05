/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import styled from '@emotion/styled';
import { Logout } from '@mui/icons-material';
import { Avatar, Badge, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { InjectedConnector } from '@wagmi/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';

import { ServiceBayLogo } from 'modules/ServiceBayLogo';
import { GlobalStateContext } from 'utils/GlobalState';
import { useBackendCall } from 'utils/useBackendCall';

import { WalletLogin } from './WalletLogin';

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
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const backendCall = useBackendCall();
  const { state, setState } = useContext(GlobalStateContext);
  const { jwt } = state.auth;

  const [enableWalletSync, setEnableWalletSync] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [avatarColor, setAvatarColor] = useState('#000');
  const { address, status } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {
        if (state.auth.jwt && !state.auth.abi && status === 'connected') {
          const abi = await backendCall('user/abi');
          state.auth.abi = abi;
          if (setState) setState(state);
        }
      })().catch((error) => console.log(error));
    }
  }, [status]);

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
        if (isConnecting) return;
        setIsConnecting(true);
        enqueueSnackbar('Detected a previous session, reconnecting with your wallet...', { variant: 'info' });
        connect();
      } else {
        setIsConnecting(false);
      }
      if (!state.auth.jwt) {
        state.auth.jwt = token;
        if (setState) setState(state);
        setEnableWalletSync(true);
      }
    }
  }, [status]);
  // ///////////////////////////////////////////////////////////////

  if (!enableWalletSync) return <></>;

  return (
    <>
      {jwt ? (
        <>
          <div className="flex flex-row space-x-1">
            <Tooltip title="Open profile">
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/user/profile')}
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
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton onClick={() => router.push('/user/logout')}>
                <Logout />
              </IconButton>
            </Tooltip>
          </div>
        </>
      ) : (
        <WalletLogin jwt={jwt} />
      )}
    </>
  );
};

export { Wallet };
