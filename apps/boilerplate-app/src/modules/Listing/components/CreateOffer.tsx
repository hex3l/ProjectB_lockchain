import { LocalOffer, ShoppingBasket } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

import { ListingDto } from 'dto/ListingDto';

import { MakeAnOffer } from './MakeAnOffer';

export const Interaction = {
  OFFER: 'offer',
  BUY: 'buy',
};

export const CreateOffer = ({
  listing,
  setConfirmBuy,
}: {
  listing: ListingDto;
  setConfirmBuy: Dispatch<SetStateAction<boolean>>;
}) => {
  const [interaction, setInteraction] = useState<string | boolean>(false);
  return (
    <>
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
          Make an Offer
        </Button>
        <MakeAnOffer
          placeholder={listing.price}
          id_listing={listing.id}
          className={`flex md:hidden h-0 ${interaction === Interaction.OFFER && 'h-[180px]'}`}
          setInteraction={setInteraction}
        />
        <Button
          variant="contained"
          startIcon={<ShoppingBasket />}
          disabled={interaction === Interaction.OFFER}
          onClick={() => setConfirmBuy(true)}
        >
          Buy
        </Button>
      </Box>
      <MakeAnOffer
        placeholder={listing.price}
        id_listing={listing.id}
        className={`md:flex hidden h-0 ${interaction === Interaction.OFFER && 'h-[180px]'}`}
        setInteraction={setInteraction}
      />
    </>
  );
};
