/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import { InjectedConnector } from '@wagmi/core';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { clone } from 'utils';
import { GlobalStateData, GlobalStateContext } from 'utils/GlobalState';

type WalletLoginProps = {
  jwt: string | null;
};

const WalletLogin = ({ jwt }: WalletLoginProps): JSX.Element => {
  const { state, setState } = useContext(GlobalStateContext);
  const [syncInProgress, setSetsyncInProgress] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const setJWT = useCallback(
    (token: string) => {
      const newState = clone(state) as GlobalStateData;
      newState.auth.jwt = token;
      if (setState) setState(newState);
      localStorage.setItem('token', token);
    },
    [setState, state],
  );

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
    if (isConnected && !jwt) {
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
        })
        .catch((error) => {
          resetSync();
          console.log(error);
        });
    }
  }, [address, isConnected]);

  // STEP 3: once we have a nounce we sign it with the wallet
  useEffect(() => {
    if (authNounce && !jwt) signMessage();
  }, [authNounce]);

  // STEP 4: when the nonce is signed we send it to the server to get a JWT token and store it in localstorage
  useEffect(() => {
    if (isSuccess) {
      const requestToken = async () => {
        const response = await fetch(`${process.env.BACKEND}/auth/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address, signedToken: data }),
        });
        const { accessToken, error, message } = await response.json();

        if (!error && accessToken !== 'undefined') return accessToken;
        else throw `${error}: ${message}`;
      };
      requestToken()
        .then((accessToken) => {
          setJWT(accessToken);
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
      {(!isConnected || !syncInProgress) && (
        <Button variant="contained" color="secondary" disabled onClick={() => handleWalletConnection()}>
          Connect your wallet
        </Button>
      )}
      {isConnected && syncInProgress && (
        <Button variant="contained" color="secondary" endIcon={<CircularProgress size="20px" color="warning" />}>
          Loading data
        </Button>
      )}
    </>
  );
};

export { WalletLogin };
