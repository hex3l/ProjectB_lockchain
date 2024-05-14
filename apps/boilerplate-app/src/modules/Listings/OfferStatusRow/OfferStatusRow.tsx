/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import {
  OrderStatus,
  OrderStatusColors,
  OrderStatusFromNumber,
  OrderStatusName,
} from 'common/consts/order-status.enum';
import { ListingDto } from 'dto/ListingDto';
import { OrderDto } from 'dto/OrderDto';
import { useBackendCall } from 'utils/useBackendCall';

const OfferStatusRow = ({
  id,
  description,
  title,
  image,
  price,
  status,
  id_listing,
  buyer,
  acceptOffer,
  hideButtons,
}: OrderDto & { hideButtons?: boolean; acceptOffer?: (id: number) => void }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const backendCall = useBackendCall();
  const [listing, setListing] = useState<ListingDto | undefined>(undefined);

  useEffect(() => {
    if (!listing) {
      if (id_listing > 0) {
        (async () => {
          const dbList = (await backendCall(`listing/${id_listing}`, { cache: 'no-store' })) as ListingDto;
          setListing(dbList);
        })().catch((err) => {
          console.error(err);
        });
      }
    }
  }, [backendCall, id_listing, listing]);

  useEffect(() => {
    const tmo = setTimeout(() => {
      if (ref.current) ref.current.classList.remove('opacity-0');
    }, 200);
    return () => clearTimeout(tmo);
  }, [ref.current]);

  return (
    <Paper
      ref={ref}
      className="flex flex-col space-y-3 p-5 transition-all opacity-0 w-full"
      sx={{ p: '10px', width: '100%', minWidth: 0 }}
    >
      <Box className="flex h-full flex-col space-y-3">
        <Box className="flex h-[75%] md:h-full flex-row space-x-3">
          <img src={image} alt="offer" className="max-h-[150px] md:max-h-[150px]" />
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
            <Box className="flex flex-col md:flex-row space-x-2">
              <Box className="flex flex-1 flex-col space-y-2">
                <Box className="flex flex-col md:flex-row md:space-x-2">
                  <Typography className="font-bold">Buyer:</Typography>
                  <Typography className="hidden md:flex font-bold flex-1 text-[#6edb38]">{buyer}</Typography>
                  <Typography className="flex md:hidden font-bold flex-1 text-[#6edb38]">{`${buyer.substring(
                    0,
                    5,
                  )}...${buyer.substring(35, buyer.length)}`}</Typography>
                </Box>
                <Box className="flex flex-col md:flex-row md:space-x-2">
                  {(status === 0 || status === 100) && (
                    <>
                      <Typography className="font-bold">Requested price:</Typography>
                      <Typography className="line-through">{listing?.price}</Typography>
                      <Typography className="font-bold flex-1 text-[#6edb38]">{price} ETH</Typography>
                    </>
                  )}
                  {status > 0 && status < 100 && (
                    <>
                      {status === 1 && <Typography className="font-bold">To be payed:</Typography>}
                      {status > 1 && <Typography className="font-bold">Payed:</Typography>}
                      <Typography className="font-bold flex-1">{price} ETH</Typography>
                    </>
                  )}
                </Box>
              </Box>
              {!hideButtons && (
                <Box className="hidden md:flex flex-row">
                  <Box className="flex items-center space-x-3">
                    {status === OrderStatus.PENDING && (
                      <>
                        <Button variant="contained" color="primary" onClick={() => acceptOffer && acceptOffer(id)}>
                          Accept
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => acceptOffer && acceptOffer(id)}>
                          Refuse
                        </Button>
                      </>
                    )}
                    {status >= OrderStatus.CONFIRMED && status <= OrderStatus.FINALIZED && (
                      <Button variant="contained" color="primary" onClick={() => router.push(`/chat/${id}`)}>
                        chat
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box className="flex md:hidden flex-row space-x-3 w-full justify-end">
          <Box className="flex-1">
            <Chip
              className=""
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
          </Box>
          {!hideButtons && (
            <>
              {status === OrderStatus.PENDING && (
                <>
                  <Button variant="contained" color="primary" onClick={() => acceptOffer && acceptOffer(id)}>
                    Accept
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => acceptOffer && acceptOffer(id)}>
                    Refuse
                  </Button>
                </>
              )}
              {status >= OrderStatus.CONFIRMED && status <= OrderStatus.FINALIZED && (
                <Button variant="contained" color="primary" onClick={() => router.push(`/chat/${id}`)}>
                  chat
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export { OfferStatusRow };
