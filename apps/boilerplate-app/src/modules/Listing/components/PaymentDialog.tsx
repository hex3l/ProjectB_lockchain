/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { CircularProgress, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { OrderStatus } from 'common/consts/order-status.enum';
import { ListingDto } from 'dto/ListingDto';
import { ListingOrderDto } from 'dto/ListingOrderDto';

import { ConfirmationDialog } from './ConfirmationDialog';

export const PaymentDialog = ({
  paymentDialogState,
  listing,
  confirm,
  listingOrder,
  payOrder,
  setupPayment,
}: {
  paymentDialogState: [boolean, Dispatch<SetStateAction<boolean>>];
  listing: ListingDto;
  listingOrder: ListingOrderDto | undefined;
  confirm: () => Promise<void>;
  payOrder: () => void;
  setupPayment: ({ order }: { order: ListingOrderDto }) => void;
}) => {
  const [paymentDialog, setPaymentDialog] = paymentDialogState;

  useEffect(() => {
    console.log('paymentDialog', paymentDialog, listingOrder);
    if (paymentDialog && listingOrder && listingOrder.status === OrderStatus.ON_CHAIN) {
      payOrder();
    }
    if (paymentDialog && listingOrder && listingOrder.status === OrderStatus.CONFIRMED) {
      setupPayment({ order: listingOrder });
    }
  }, [paymentDialog]);

  return (
    <ConfirmationDialog
      open={paymentDialog}
      setOpen={setPaymentDialog}
      confirm={confirm}
      amount={listing.price}
      hideControls={listingOrder && listingOrder.status >= OrderStatus.CONFIRMED}
    >
      {listingOrder && listingOrder.status >= OrderStatus.CONFIRMED && (
        <div className="flex flex-row justify-center items-center">
          <CircularProgress />
        </div>
      )}
      <Typography>
        {listingOrder?.status === OrderStatus.ON_CHAIN && <>Procede with payment...</>}

        {listingOrder?.status === OrderStatus.CONFIRMED && <>Contract preparation, awaiting oracle...</>}

        {!listingOrder && <>Confirm your purchase for {listing.price} ETH?</>}
      </Typography>
    </ConfirmationDialog>
  );
};
