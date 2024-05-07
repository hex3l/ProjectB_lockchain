/* eslint-disable @typescript-eslint/no-floating-promises */
import { Box, Button, Dialog, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

export const ConfirmationDialog = ({
  children,
  isOffer,
  open,
  setOpen,
  confirm,
  amount,
}: {
  children?: React.ReactNode;
  isOffer?: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  confirm: () => Promise<void>;
  amount: number;
}) => {
  const [disableInteraction, setDisableInteraction] = useState(false);
  const confirmWrapper = () => {
    setDisableInteraction(true);
    confirm();
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box className="flex flex-col gap-3 p-5">
        <Typography className="font-bold text-lg">
          {`You are ${isOffer ? 'offering' : 'paying'} ${amount} ETH`}
        </Typography>
        {children}
        <Box className="flex flex-row gap-3">
          <Button
            variant="contained"
            color="primary"
            onClick={() => confirmWrapper()}
            disabled={disableInteraction}
            fullWidth
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpen(false)}
            disabled={disableInteraction}
            fullWidth
          >
            Back
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
