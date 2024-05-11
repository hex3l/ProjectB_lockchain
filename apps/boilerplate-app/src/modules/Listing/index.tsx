/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { FavoriteBorder, Flag, Share } from '@mui/icons-material';
import Favorite from '@mui/icons-material/Favorite';
import { Avatar, Box, Chip, Container, Divider, IconButton, Paper, Rating, Stack, Typography } from '@mui/material';
import { watchContractEvent } from '@wagmi/core';
import { useSnackbar } from 'notistack';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { Slide } from 'react-slideshow-image';
import { parseEther } from 'viem';
import { useConfig, useWriteContract } from 'wagmi';

import { OrderStatus } from 'common/consts/order-status.enum';
import { ListingDto } from 'dto/ListingDto';
import { ListingOrderDto } from 'dto/ListingOrderDto';
import { GlobalStateContext } from 'utils/GlobalState';
import { useBackendCall } from 'utils/useBackendCall';

import { CreateOffer } from './components/CreateOffer';
import { OrderManager } from './components/OrderManager';
import { PaymentDialog } from './components/PaymentDialog';

const ListingComponent = ({
  id_listing,
  dialog,
  closeDialog,
}: {
  id_listing: number;
  dialog?: boolean;
  closeDialog?: () => void;
}) => {
  const { state } = useContext(GlobalStateContext);
  const { abi, contract } = state.auth;
  const [listing, setListing] = useState<ListingDto | undefined>(undefined);
  const [listingOrder, setListingOrder] = useState<ListingOrderDto | undefined>(undefined);
  const { id, price } = listingOrder ?? {};
  const [fetchError, setFetchError] = useState(false);

  const backendCall = useBackendCall();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!listing && !fetchError) {
      if (id_listing > 0) {
        (async () => {
          const dbList = (await backendCall(`listing/${id_listing}`, { cache: 'no-store' })) as ListingDto;
          if (!!localStorage.getItem('token')) {
            const dbOrder = (await backendCall(`order/listing/${id_listing}`, {
              cache: 'no-store',
            })) as ListingOrderDto;
            setListingOrder(dbOrder);
          }
          setListing(dbList);
        })().catch((err) => {
          setFetchError(true);
          if (closeDialog) closeDialog();
          console.error(err);
        });
      }
    }
  }, [backendCall, closeDialog, fetchError, id_listing, listing]);

  const favorite = useCallback(async () => {
    const data: unknown = await backendCall(`user/favorite`, {
      method: 'POST',
      body: JSON.stringify({ listing_id: id_listing }),
    });
    if (data !== undefined) {
      setListing({ ...listing, favorite: (data as { favorite: boolean }).favorite } as ListingDto);
    }
  }, [backendCall, id_listing, listing]);

  const report = useCallback(() => {
    enqueueSnackbar({ message: 'Thank you for the report!', variant: 'info' });
  }, [enqueueSnackbar]);

  const share = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    enqueueSnackbar({ message: 'URL copied to clipboard', variant: 'success' });
  }, [enqueueSnackbar]);

  // //////////////////////////////////////////////////////////////////////////
  // Handle buy
  const paymentDialogState = useState(false);
  const [confirmBuy, setConfirmBuy] = paymentDialogState;
  const { writeContract } = useWriteContract();

  // Creates deal on chain by calling the pay endpoint
  const setupPayment = useCallback(({ order }: { order: ListingOrderDto }) => {
    backendCall(`order/pay`, {
      method: 'POST',
      body: JSON.stringify({ id_order: order.id }),
    }).catch((err) => {
      enqueueSnackbar('An error occured, order is unpayable!', { variant: 'error' });
      setConfirmBuy(false);
    });
    setListingOrder({ ...order, status: 1 });
  }, []);

  // Triggers payment through metamask
  const payOrder = useCallback(() => {
    console.log(id, price);
    if (contract && id && price)
      writeContract(
        {
          abi,
          address: contract,
          functionName: 'payDeal',
          args: [BigInt(id)],
          value: parseEther(`${price}`),
        },
        { onError: (err) => console.error(err) },
      );
  }, [abi, contract, id, price, writeContract]);

  const config = useConfig();
  useEffect(() => {
    if (id && contract && abi) {
      const onLogs = async (logs: any) => {
        for (const log of logs) {
          console.log('Blockchain event:', log.eventName);
          switch (log.eventName) {
            case 'CreatedDeal':
              if (listingOrder) setListingOrder({ ...listingOrder, status: OrderStatus.ON_CHAIN });
              payOrder();
              break;
            case 'Payed':
              if (listingOrder) setListingOrder({ ...listingOrder, status: OrderStatus.ACTIVE });
              setConfirmBuy(false);
              enqueueSnackbar('Order payed succesfully', { variant: 'success' });
              break;
          }
        }
      };
      const watchConfig = {
        address: contract,
        abi,
        onLogs,
      };

      return watchContractEvent(config, watchConfig);
    }
  }, [payOrder, contract, abi, id]);

  // Creates the buy order on backend, triggering the whole flow
  const confirm = useCallback(async () => {
    try {
      const result = (await backendCall(`order/create`, {
        method: 'POST',
        body: JSON.stringify({ id_listing, price: parseFloat(`${listing?.price}`) }),
      })) as ListingOrderDto;
      setListingOrder(result);
      enqueueSnackbar('Order created, waiting for oracle chain event...', { variant: 'success' });
      setTimeout(() => {
        setupPayment({ order: result });
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  }, [backendCall, enqueueSnackbar, setupPayment, id_listing, listing?.price]);

  return (
    listing && (
      <Container maxWidth="xl" className={`flex flex-col px-0 ${!dialog ? 'pt-10 pb-10 gap-5' : ''}`}>
        <Box>
          <Paper variant="outlined">
            <Box className="flex md:flex-row flex-col">
              <Box className="md:w-[400px] md:h-[400px] w-full">
                <Slide>
                  <Box className="flex justify-center">
                    <img alt="lising" src={listing.image} className="max-w-full" />
                  </Box>
                </Slide>
              </Box>
              <Box className="flex flex-1 flex-col gap-1 pb-5 pl-5">
                <Box className="flex flex-row">
                  <Stack direction="row" spacing={1} className="flex-1 pt-5">
                    <Chip label={listing.category.name} color="info" size="small" />
                  </Stack>
                  <Paper className="flex flex-end items-center h-[60px] justify-center gap-1 px-3">
                    <IconButton
                      onClick={() => {
                        favorite().catch((err) => console.error(err));
                      }}
                    >
                      {listing?.favorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton
                      aria-label="share"
                      onClick={() => {
                        share().catch((err) => console.error(err));
                      }}
                    >
                      <Share />
                    </IconButton>
                    <IconButton aria-label="report" onClick={() => report()}>
                      <Flag />
                    </IconButton>
                  </Paper>
                </Box>
                <Box className="flex flex-col flex-1 pr-5 gap-y-2">
                  <Typography sx={{ fontSize: '36px' }}>{listing.title}</Typography>

                  <Typography color="text.secondary" display="block" variant="caption">
                    Published on {new Date(listing.updated).toLocaleDateString()}
                  </Typography>
                  <Typography className="flex-1">{listing.description}</Typography>
                  {!listingOrder && <CreateOffer listing={listing} setConfirmBuy={setConfirmBuy} />}
                  {listingOrder && (
                    <OrderManager listing={listing} listingOrder={listingOrder} setConfirmBuy={setConfirmBuy} />
                  )}
                  <Divider className="pt-3" />
                  <Box className="flex flex-row gap-3 pt-3">
                    <Avatar />
                    <Box className="flex flex-col md:flex-none flex-1 justify-center">
                      <Typography className="break-all">{listing.creator.address}</Typography>
                      <Typography>Seller since {new Date(listing.creator.created).toLocaleDateString()}</Typography>
                    </Box>
                    <Box className="flex items-center">
                      <Rating
                        name="half-rating-read"
                        defaultValue={listing.creator.rating}
                        precision={0.25}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
        <PaymentDialog
          paymentDialogState={paymentDialogState}
          confirm={confirm}
          listing={listing}
          listingOrder={listingOrder}
          payOrder={payOrder}
          setupPayment={setupPayment}
        />
      </Container>
    )
  );
};

export const Listing = memo(ListingComponent);
