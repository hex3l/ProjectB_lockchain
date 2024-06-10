/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import styled from '@emotion/styled';
import { Logout, VisibilityOff } from '@mui/icons-material';
import { Avatar, Badge, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { injected } from '@wagmi/core';
import { readContract } from '@wagmi/core';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useAccount, useConfig, useConnect, useDisconnect } from 'wagmi';
// import { injected } from 'wagmi/connectors';

import { ServiceBayLogo } from 'modules/ServiceBayLogo';
import { useRandomColor } from 'modules/utils/useRandomColor';
import { clone } from 'utils';
import { GlobalStateContext, GlobalStateData, emptyGlobalState } from 'utils/GlobalState';
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
  const config = useConfig();
  const { state, setState } = useContext(GlobalStateContext);
  const { jwt, nuggetAbi, nuggetContract } = state.auth;

  const [enableWalletSync, setEnableWalletSync] = useState(false);
  const [handledDisconnect, setHandledDisconnect] = useState(false);
  const [myNugget, setMyNugget] = useState<null | string>(null);
  const avatarColor = useRandomColor();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {
        if (state.auth.jwt && !state.auth.abi && status === 'connected') {
          const { abi, contract } = await backendCall('user/abi');
          state.auth.abi = abi;
          state.auth.contract = contract;
          const { abi: nuggetAbi, contract: nuggetContract } = await backendCall('user/nuggetabi');
          state.auth.nuggetAbi = nuggetAbi;
          state.auth.nuggetContract = nuggetContract;
          if (setState) setState(state);
        }
      })().catch((error) => console.log(error));
    }
  }, [status]);

  const refreshNuggets = useCallback(async () => {
    if (!!nuggetContract && !!nuggetAbi && !!address) {
      const nuggets = await readContract(config, {
        abi: nuggetAbi,
        address: nuggetContract,
        functionName: 'balanceOf',
        args: [address],
      });
      setMyNugget(`${nuggets}`);
    }
  }, [nuggetContract, nuggetAbi?.contractName, address]);

  // //////////////////////////////////////////////////////////////
  // Handle connection logic when a token exists and retries until it can connect with metamask

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!state.auth.jwt) {
        state.auth.jwt = token;
        if (setState) setState(state);
        setEnableWalletSync(true);
      }
    }
  }, [status]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tout = setTimeout(() => {
        if (state.auth.jwt && status === 'disconnected' && !handledDisconnect) {
          enqueueSnackbar('Detected a previous session, reconnecting with your wallet...', { variant: 'info' });
          connect({ connector: injected() });
        }
        setHandledDisconnect(true);
      }, 1000);
      return () => clearTimeout(tout);
    }
  }, [status]);
  // //////////////////////////////////////////////////////////////*/

  const disconnectMe = useCallback(() => {
    const newState = clone(state) as GlobalStateData;
    newState.auth = emptyGlobalState.auth;
    localStorage.removeItem('token');
    setTimeout(() => {
      if (setState) setState(newState);
      disconnect();
      enqueueSnackbar('You have been successfully disconnected, redirecting to homepage...', { variant: 'success' });
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }, 500);
  }, []);

  if (!enableWalletSync) return <></>;

  return (
    <>
      {jwt ? (
        <>
          <div className="flex flex-row space-x-2">
            <Tooltip title="My golden nuggets">
              <div id="refresh_nuggets" className="flex flex-row items-center" onClick={() => refreshNuggets()}>
                <div className="flex items-center">{myNugget ?? <VisibilityOff className="w-[16px]" />}</div>
                <div className="w-[30px] flex items-center">
                  <img className="w-full" src="/assets/gold_nugget.png"></img>
                </div>
              </div>
            </Tooltip>
            <Tooltip title="Open profile">
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/user/profile')}
                sx={{ p: 0 }}
                className="text-[13px] p-1 flex flex-row"
              >
                <>
                  {!['connected', 'reconnecting'].includes(status) ? (
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
              <IconButton onClick={() => disconnectMe()}>
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
