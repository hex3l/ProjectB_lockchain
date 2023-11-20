/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Avatar, CircularProgress, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { InjectedConnector } from '@wagmi/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

const loggedInSettings = [
  { label: 'Profile', url: '/user/profile' },
  { label: 'Logout', url: '/user/logout' },
];
const WalletLogin = () => {
  const [enableWalletSync, setEnableWalletSync] = useState(false);
  const [syncInProgress, setSetsyncInProgress] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  useEffect(() => {
    setTimeout(() => {
      setEnableWalletSync(true);
    }, 1000);
  }, []);

  const hasJwt = () => {
    if (typeof window !== 'undefined' && enableWalletSync) {
      const token = localStorage.getItem('token');

      return !!token;
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { disconnect } = useDisconnect();

  const [authNounce, setAuthNounce] = useState<undefined | string>(undefined);
  const { data, isError, isSuccess, signMessage, reset } = useSignMessage({ message: authNounce });

  // STEP 1: on user click on button start wallet connection
  const handleWalletConnection = () => {
    if (!isConnected) {
      connect();
    }
  };

  const resetSync = () => {
    setSetsyncInProgress(false);
    setAuthNounce(undefined);
    reset();
    disconnect();
  };

  // STEP 2: when wallet is succesfully connected we contact the server to get a nounce
  useEffect(() => {
    // If connected but does not have a JWT token, then we need to get one
    if (isConnected && !hasJwt()) {
      const loginProcess = async () => {
        setSetsyncInProgress(true);
        const nounce = await fetch(`${process.env.BACKEND}/auth/request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await nounce.json();
      };
      loginProcess()
        .then(({ message }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setAuthNounce(message);
          console.log(message);
        })
        .catch((error) => {
          resetSync();
          console.log(error);
        });
    }
  }, [address, isConnected]);

  // STEP 3: once we have a nounce we sign it with the wallet
  useEffect(() => {
    if (authNounce && !hasJwt()) signMessage();
  }, [authNounce]);

  // STEP 4: when the nonce is signed we send it to the server to get a JWT token and store it in localstorage
  useEffect(() => {
    if (isSuccess) {
      const requestToken = async () => {
        const nounce = await fetch(`${process.env.BACKEND}/auth/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address, signedToken: data }),
        });
        const { accessToken, error, message } = await nounce.json();

        console.log(accessToken, error, message);
        if (!error && accessToken !== 'undefined') return accessToken;
        else throw `${error}: ${message}`;
      };
      requestToken()
        .then((accessToken) => {
          localStorage.setItem('token', accessToken);
          console.log(accessToken);
        })
        .catch((error) => {
          resetSync();
          console.log(error);
        });
    }
    if (isError) {
      resetSync();
    }
  }, [isError, isSuccess]);

  return (
    <>
      {isConnected && hasJwt() && (
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
      )}
      {((!isConnected && !hasJwt()) || !syncInProgress) && (
        <Button variant="contained" color="success" onClick={() => handleWalletConnection()}>
          Connect your wallet
        </Button>
      )}
      {isConnected && !hasJwt() && syncInProgress && (
        <Button variant="contained" color="success" endIcon={<CircularProgress size="20px" color="warning" />}>
          Loading data
        </Button>
      )}
    </>
  );
};

export { WalletLogin };
