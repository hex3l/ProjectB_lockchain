import { Box } from '@mui/material';
import { Fragment } from 'react';

import { OfferRow } from 'modules/Listings/OfferRow';
import { useInfiniScrollListings } from 'utils/useInfiniScrollListings';

export const MyFavorites = () => {
  const { listings, PullListings } = useInfiniScrollListings({
    states: 'all',
    favorite: true,
  });

  return (
    <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
      {listings?.map(({ id, ...listing }) => (
        <Fragment key={id}>
          <OfferRow {...{ id, ...listing }} showStatus />
        </Fragment>
      ))}
      <PullListings />
    </Box>
  );
};
