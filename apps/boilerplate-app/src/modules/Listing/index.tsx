/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { FavoriteBorder, Flag, LocalOffer, Share, ShoppingBasket } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Slide } from 'react-slideshow-image';

import { ListingDto } from 'dto/ListingDto';
import { useBackendCall } from 'utils/useBackendCall';

export const Listing = ({
  id_listing,
  dialog,
  closeDialog,
}: {
  id_listing: number;
  dialog?: boolean;
  closeDialog?: () => void;
}) => {
  const [listing, setListing] = useState<ListingDto | undefined>(undefined);

  const backendCall = useBackendCall();

  useEffect(() => {
    if (id_listing > 0) {
      (async () => {
        const dbList = (await backendCall(`listing/${id_listing}`, { cache: 'no-store' })) as ListingDto;
        setListing(dbList);
      })().catch((err) => {
        console.error(err);
      });
    }
  }, [id_listing]);

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
                    <IconButton>
                      <FavoriteBorder />
                    </IconButton>
                    <IconButton aria-label="share">
                      <Share />
                    </IconButton>
                    <IconButton aria-label="report">
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
                  <Box className="flex md:flex-row  flex-col gap-1">
                    <Box className="flex-1">
                      <Typography sx={{ fontSize: '24px' }} className="mr-5">
                        {listing.price} ETH
                      </Typography>
                    </Box>

                    <Button variant="contained" startIcon={<LocalOffer />} color="secondary">
                      Make an Offer
                    </Button>
                    <Button variant="contained" startIcon={<ShoppingBasket />}>
                      Buy
                    </Button>
                  </Box>
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
