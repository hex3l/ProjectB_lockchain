/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { History } from '@mui/icons-material';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';

import { ListingDto } from 'dto/ListingDto';
import { Offer } from 'modules/Listings/OfferBox';
import { useBackendCall } from 'utils/useBackendCall';

const LatestPicks = () => {
  const backendCall = useBackendCall();
  const [listings, setListings] = useState<Array<ListingDto> | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined') {
        const queryParams: Record<string, string> = {
          take: '8',
          page: '1',
        };
        const dbList = (await backendCall(`listing?${new URLSearchParams(queryParams)}`, {})) as Array<ListingDto>;

        setListings(dbList);
      }
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <Box className="shadow-s-top w-full">
      <Container maxWidth="xl" className="pt-10">
        <div className="flex flex-row items-center pb-5 space-x-1">
          <History className="text-blue-600" />
          <div>Recent listings</div>
        </div>
        <Box className="flex flex-wrap flex-row gap-10 justify-evenly">
          {listings?.map(({ id, ...listing }) => (
            <Offer key={id} {...{ ...listing, name: listing.title, price: `${listing.price}`, id: `${id}` }} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export { LatestPicks };
