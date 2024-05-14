/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { ChatBubble, ShoppingBasket } from '@mui/icons-material';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { useAccount } from 'wagmi';

import {
  OrderStatus,
  OrderStatusColors,
  OrderStatusFromNumber,
  OrderStatusName,
} from 'common/consts/order-status.enum';
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
  const { address } = useAccount();
  const orderStatus: OrderStatus = OrderStatusFromNumber[listingOrder.status as keyof typeof OrderStatusFromNumber];
  return (
    <>
      <Box className="flex md:flex-row flex-col gap-1 items-center">
        <Box className="flex-1">
          {listingOrder.price != listing.price && (
            <Typography sx={{ fontSize: '24px' }} className="mr-5 line-through">
              {listing.price}
            </Typography>
          )}
          <Typography sx={{ fontSize: '24px' }} className="mr-5">
            {listingOrder.price} ETH
          </Typography>
        </Box>

        <Box className="">
          <Chip
            className="hidden md:flex"
            color={
              OrderStatusColors[orderStatus] as
                | 'default'
                | 'success'
                | 'warning'
                | 'error'
                | 'primary'
                | 'secondary'
                | 'info'
            }
            label={OrderStatusName[orderStatus].toUpperCase()}
          />
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
            Chat with {listing.creator.address === address ? 'buyer' : 'seller'}
          </Button>
        )}
      </Box>
    </>
  );
};
