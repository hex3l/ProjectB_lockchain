import { Close, LocalOffer } from '@mui/icons-material';
import {
  Box,
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { useBackendCall } from 'utils/useBackendCall';

import { ConfirmationDialog } from './ConfirmationDIalog';

export const MakeAnOffer = ({
  className,
  placeholder,
  id_listing,
  setInteraction,
}: {
  className: string;
  placeholder: number;
  id_listing: number;
  setInteraction: Dispatch<SetStateAction<string | boolean>>;
}) => {
  const backendCall = useBackendCall();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmatin, setConfirmation] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number | string>('');

  const confirm = useCallback(async () => {
    await backendCall(`order/create`, {
      method: 'POST',
      body: JSON.stringify({ id_listing, price: offerAmount }),
    })
      .then(() => {
        enqueueSnackbar('Your offer has been sent to the seller, wait for a response!', { variant: 'success' });
        setConfirmation(false);
        setInteraction(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [backendCall, enqueueSnackbar, id_listing, offerAmount, setInteraction]);

  return (
    <Box
      className={`h-0 ${className} overflow-hidden w-full`}
      sx={{
        transition: 'height 0.30s linear',
      }}
    >
      <Box className="py-2 px-5 flex-col w-full space-y-2 bg-[#00897b] rounded-lg">
        <Box className="f-full flex flex-row items-center">
          <Box className="flex-1 font-bold">Choose how much you want to offer</Box>
          <IconButton onClick={() => setInteraction(false)}>
            <Close />
          </IconButton>
        </Box>
        <FormControl fullWidth variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            color="primary"
            value={offerAmount}
            type="number"
            placeholder={`${placeholder}`}
            onChange={(ev) => {
              console.log(ev.target.value);
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (parseFloat(ev.target.value ?? '0') <= placeholder)
                setOfferAmount(ev.target.value ? parseFloat(ev.target.value) : '');
            }}
            startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
          />
        </FormControl>
        <Button
          variant="contained"
          startIcon={<LocalOffer />}
          color="primary"
          disabled={offerAmount === ''}
          onClick={() => setConfirmation(true)}
          fullWidth
        >
          Make Offer
        </Button>
        <ConfirmationDialog
          open={confirmatin}
          setOpen={setConfirmation}
          confirm={confirm}
          amount={typeof offerAmount === 'string' ? 0 : offerAmount}
        >
          <Typography>Confirm your offer to the seller?</Typography>
        </ConfirmationDialog>
      </Box>
    </Box>
  );
};
