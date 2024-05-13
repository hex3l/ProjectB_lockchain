/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import {
  OrderStatus,
  OrderStatusColors,
  OrderStatusFromNumber,
  OrderStatusName,
} from 'common/consts/order-status.enum';
import { OrderDto } from 'dto/OrderDto';

const OfferStatusRow = ({
  id,
  description,
  title,
  image,
  price,
  status,
  acceptOffer,
}: OrderDto & { acceptOffer?: (id: number) => void }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tmo = setTimeout(() => {
      if (ref.current) ref.current.classList.remove('opacity-0');
    }, 200);
    return () => clearTimeout(tmo);
  }, [ref.current]);

  return (
    <Paper
      ref={ref}
      className="flex flex-col space-y-3 p-5 transition-all opacity-0 h-[200px] md:h-[180px]"
      sx={{ p: '10px', width: '100%', minWidth: 0, height: '180px' }}
    >
      <Box className="flex h-full flex-col space-y-3">
        <Box className="flex h-[75%] md:h-full flex-row space-x-3">
          <img src={image} alt="offer" className="max-h-[260px]" />
          <Box className="flex flex-col flex-1">
            <Box className="flex flex-col-reverse md:flex-row md:items-center">
              <Box className="flex-1">
                <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
              </Box>
              <Box className="flex flex-row w-full justify-end md:w-auto items-center">
                <Chip
                  className="hidden md:flex"
                  color={
                    OrderStatusColors[OrderStatusFromNumber[status as keyof typeof OrderStatusFromNumber]] as
                      | 'default'
                      | 'success'
                      | 'warning'
                      | 'error'
                      | 'primary'
                      | 'secondary'
                      | 'info'
                  }
                  label={OrderStatusName[
                    OrderStatusFromNumber[status as keyof typeof OrderStatusFromNumber]
                  ].toUpperCase()}
                />
              </Box>
            </Box>

            <Box className="flex-1" sx={{ pt: 0.5 }}>
              <Typography className="hidden md:flex">
                {description.length > 250 ? `${description.slice(0, 250)}...` : description}
              </Typography>
            </Box>
          </Box>
        </Box>
        {status === OrderStatus.PENDING && (
          <Box className="flex h-[75%] md:h-full flex-row space-x-3">
            <Button variant="contained" color="primary" onClick={() => acceptOffer && acceptOffer(id)}>
              Accept
            </Button>
            <Button variant="contained" color="secondary" onClick={() => acceptOffer && acceptOffer(id)}>
              Refuse
            </Button>
          </Box>
        )}
        {status >= OrderStatus.CONFIRMED && status <= OrderStatus.FINALIZED && (
          <Button onClick={() => router.push(`/chat/${id}`)}>chat</Button>
        )}
      </Box>
      <Box className="md:hidden flex flex-row items-end">
        <Box className="flex flex-1 flex-row md:flex-row space-x-2 items-center">
          <Typography className="font-bold flex-1">{price} ETH</Typography>
          <Chip
            className="hidden md:flex"
            color={
              OrderStatusColors[OrderStatusFromNumber[status as keyof typeof OrderStatusFromNumber]] as
                | 'default'
                | 'success'
                | 'warning'
                | 'error'
                | 'primary'
                | 'secondary'
                | 'info'
            }
            label={OrderStatusName[OrderStatusFromNumber[status as keyof typeof OrderStatusFromNumber]].toUpperCase()}
          />
          {status === OrderStatus.PENDING && (
            <Box className="flex h-[75%] md:h-full flex-row space-x-3">
              <Button variant="contained" color="primary" onClick={() => acceptOffer && acceptOffer(id)}>
                Accept
              </Button>
              <Button variant="contained" color="secondary" onClick={() => acceptOffer && acceptOffer(id)}>
                Refuse
              </Button>
            </Box>
          )}
          {status >= OrderStatus.CONFIRMED && status <= OrderStatus.FINALIZED && (
            <Button onClick={() => router.push(`/chat/${id}`)}>chat</Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export { OfferStatusRow };
