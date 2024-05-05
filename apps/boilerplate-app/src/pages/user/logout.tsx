/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useDisconnect } from 'wagmi';

import { clone } from 'utils';
import { GlobalStateData, GlobalStateContext } from 'utils/GlobalState';

const Page = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const newState = clone(state) as GlobalStateData;
    newState.auth = { jwt: null, abi: null };
    localStorage.removeItem('token');
    setTimeout(() => {
      if (setState) setState(newState);
      disconnect();
    }, 50);
  }, []);

  return (
    <Box>
      <Typography variant="h1">Disconnected!</Typography>
      <Typography variant="h3">You will now be redirected to the homepage!</Typography>
    </Box>
  );
};

export default Page;
