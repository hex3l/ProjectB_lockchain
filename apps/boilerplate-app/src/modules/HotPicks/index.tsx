import { WhatshotOutlined } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';

import { Offer } from 'modules/Listings/OfferBox';

import listings from '../../common/listings.json';

const HotPicks = () => {
  return (
    <Box className="shadow-s-top w-full">
      <Container maxWidth="xl" className="pt-10">
        <Typography className="flex justify-items-center pb-5 pl-3">
          <WhatshotOutlined className="text-orange-600" /> Currently trending
        </Typography>
        <Box className="flex flex-wrap flex-row gap-10 justify-evenly">
          {listings.map(({ id, ...listing }) => (
            <Offer key={id} {...{ ...listing, id }} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export { HotPicks };
