/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { ChatBubble, ShoppingBasket } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

import { OrderStatus, OrderStatusFromNumber, OrderStatusName } from 'common/consts/order-status.enum';
import { ListingDto } from 'dto/ListingDto';
import { ListingOrderDto } from 'dto/ListingOrderDto';

export const Interaction = {
  OFFER: 'offer',
  BUY: 'buy',
};

export const OrderManager = ({
  listing,
  listingOrder,
  setConfirmBuy,
}: {
  listing: ListingDto;
  listingOrder: ListingOrderDto;
  setConfirmBuy: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  return (
    <>
      <Box className="flex md:flex-row flex-col gap-1">
        <Box className="flex-1">
          <Typography sx={{ fontSize: '24px' }} className="mr-5">
            Your price: {listing.price} ETH
          </Typography>
        </Box>

        <Box className="">
          <Typography sx={{ fontSize: '24px' }} className="mr-5">
            Status: {`${OrderStatusName[OrderStatusFromNumber[`${listingOrder.status}`]]}`}
          </Typography>
        </Box>

        {listingOrder.status < OrderStatus.ACTIVE && (
          <Button variant="contained" startIcon={<ShoppingBasket />} onClick={() => setConfirmBuy(true)}>
            Pay order
          </Button>
        )}

        {listingOrder.status === OrderStatus.ACTIVE && (
          <Button
            variant="contained"
            startIcon={<ChatBubble />}
            onClick={() => router.push(`/chat/${listingOrder.id}`)}
          >
            Chat with seller
          </Button>
        )}
      </Box>
    </>
  );
};
