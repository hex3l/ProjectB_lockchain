import { Box, Button, Dialog, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

const PayOrderDialog = ({
  open,
  setOpen,
  price,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  price: number;
}) => {
  const [currentState, setCurrentState] = useState('confirmation');

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {currentState === 'confirmation' && (
        <Box className="flex flex-col gap-3 p-5">
          <Typography className="font-bold text-lg">Confirm the order for {price} ETH</Typography>
          <Box className="flex flex-row gap-3">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentState('wait_chain');
              }}
              fullWidth
            >
              Confirm
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setOpen(false)} fullWidth>
              Back
            </Button>
          </Box>
        </Box>
      )}
      {currentState === 'wait_chain' && (
        <Box className="flex flex-col gap-3 p-5">
          <Typography className="font-bold text-lg">Waiting for blockchain sync</Typography>
        </Box>
      )}
      {currentState === 'payment' && (
        <Box className="flex flex-col gap-3 p-5">
          <Typography className="font-bold text-lg">Order is on chain, proceed with payment</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCurrentState('wait_chain');
            }}
            fullWidth
          >
            Pay order
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export { PayOrderDialog };
