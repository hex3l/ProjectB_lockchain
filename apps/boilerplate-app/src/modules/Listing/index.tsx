/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { Close, FavoriteBorder, Flag, LocalOffer, Share, ShoppingBasket } from '@mui/icons-material';
import Favorite from '@mui/icons-material/Favorite';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { is } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import { Dispatch, SetStateAction, memo, useCallback, useEffect, useState } from 'react';
import { Slide } from 'react-slideshow-image';

import { OrderStatus } from 'common/consts/order-status.enum';
import { ListingDto } from 'dto/ListingDto';
import { ListingOrderDto } from 'dto/ListingOrderDto';
import { useBackendCall } from 'utils/useBackendCall';

export const Interaction = {
  OFFER: 'offer',
  BUY: 'buy',
};

const ListingComponent = ({
  id_listing,
  dialog,
  closeDialog,
}: {
  id_listing: number;
  dialog?: boolean;
  closeDialog?: () => void;
}) => {
  const [listing, setListing] = useState<ListingDto | undefined>(undefined);
  const [listingOrder, setListingOrder] = useState<ListingOrderDto | undefined>(undefined);
  const [interaction, setInteraction] = useState<string | boolean>(false);
  const [fetchError, setFetchError] = useState(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(!!listing?.favorite);

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
      const result = !!data;
      setIsFavorited(result);
    }
  }, [backendCall, id_listing]);

  const report = useCallback(() => {
    enqueueSnackbar({ message: 'Thank you for the report!', variant: 'info' });
  }, [enqueueSnackbar]);

  const share = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    enqueueSnackbar({ message: 'URL copied to clipboard', variant: 'success' });
  }, [enqueueSnackbar]);

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
                      {isFavorited ? <Favorite /> : <FavoriteBorder />}
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
                  <Box className="flex md:flex-row flex-col gap-1">
                    <Box className="flex-1">
                      <Typography sx={{ fontSize: '24px' }} className="mr-5">
                        {listing.price} ETH
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<LocalOffer />}
                      color="secondary"
                      disabled={interaction === Interaction.OFFER}
                      onClick={() => setInteraction(Interaction.OFFER)}
                    >
                      {listingOrder?.status !== undefined
                        ? listingOrder.status < 5
                          ? `View your ${listingOrder.status < 2 ? 'offer' : 'order'} of ${
                              listingOrder.price
                            }ETH that is ${OrderStatus[`${listingOrder.status}` as keyof typeof OrderStatus]}`
                          : listingOrder.status < 100
                          ? 'Order Completed'
                          : 'Order Rejected'
                        : 'Make an Offer'}
                    </Button>
                    <MakeAnOffer
                      placeholder={listing.price}
                      id_listing={id_listing}
                      className={`flex md:hidden h-0 ${interaction === Interaction.OFFER && 'h-[180px]'}`}
                      setInteraction={setInteraction}
                    />
                    <Button
                      variant="contained"
                      startIcon={<ShoppingBasket />}
                      disabled={interaction === Interaction.OFFER || listingOrder?.status !== undefined}
                      onClick={() => setInteraction(Interaction.BUY)}
                    >
                      Buy
                    </Button>
                  </Box>
                  <MakeAnOffer
                    placeholder={listing.price}
                    id_listing={id_listing}
                    className={`md:flex hidden h-0 ${interaction === Interaction.OFFER && 'h-[180px]'}`}
                    setInteraction={setInteraction}
                  />
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
      </Container>
    )
  );
};

const MakeAnOffer = ({
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
  const [offerAmount, setOfferAmount] = useState<number | null>(null);

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
                setOfferAmount(ev.target.value ? parseFloat(ev.target.value) : null);
            }}
            startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
          />
        </FormControl>
        <Button
          variant="contained"
          startIcon={<LocalOffer />}
          color="primary"
          disabled={offerAmount === null}
          onClick={() => setConfirmation(true)}
          fullWidth
        >
          Make Offer
        </Button>
        <ConfirmationDialog
          open={confirmatin}
          setOpen={setConfirmation}
          confirm={confirm}
          title="Confirm your offer to the seller?"
          amount={offerAmount ?? 0}
        />
      </Box>
    </Box>
  );
};

const ConfirmationDialog = ({
  isOffer,
  open,
  setOpen,
  confirm,
  title,
  amount,
}: {
  isOffer?: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  confirm: () => Promise<void>;
  title: string;
  amount: number;
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box className="flex flex-col gap-3 p-5">
        <Typography className="font-bold text-lg">
          {`You are ${isOffer ? 'offering' : 'paying'} ${amount} ETH`}
        </Typography>
        <Typography>{title}</Typography>
        <Box className="flex flex-row gap-3">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              confirm();
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
    </Dialog>
  );
};

export const Listing = memo(ListingComponent);
