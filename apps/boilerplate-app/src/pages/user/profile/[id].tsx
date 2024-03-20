import FavoriteIcon from '@mui/icons-material/Favorite';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Avatar, Box, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Offer } from 'modules/Listings/OfferBox/Offer';
import { useState } from 'react';
import React from 'react';

import listingsFav from '../../../common/listingFav.json';
import listingsMy from '../../../common/listingMy.json';
import listings from '../../../common/listings copy.json';

const Page = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Container fixed>
      <Box className="flex flex-row gap-3 pt-3">
        <Avatar sx={{ width: 96, height: 96 }} />
        <Box className="flex flex-col md:flex-none flex-1 justify-center">
          <Typography>0xb1053CA73a40d24FDb6A24Cb536651C0A58C4381</Typography>
          <Divider />
          <Typography variant="caption" display="block" gutterBottom>
            Seller since 2021
          </Typography>
        </Box>
      </Box>
      <Box sx={{ bgcolor: '#1c1c1c', borderRadius: '16px', m: '16px' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example justify-center"
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<InventoryIcon />} label="Purchased" />
          <Tab icon={<FavoriteIcon />} label="Favorite" />
          <Tab icon={<LocalOfferIcon />} label="My listings" />
        </Tabs>
      </Box>
      <Box>
        {value === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
              {listings.map(({ id, ...listing }) => (
                <Offer description={''} name={''} image={''} price={''} key={id} {...{ ...listing, id }} />
              ))}
            </Box>
          </Box>
        )}
        {value === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
              {listingsFav.map(({ id, ...listing }) => (
                <Offer description={''} name={''} image={''} price={''} key={id} {...{ ...listing, id }} />
              ))}
            </Box>
          </Box>
        )}
        {value === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
              {listingsMy.map(({ id, ...listing }) => (
                <Offer description={''} name={''} image={''} price={''} key={id} {...{ ...listing, id }} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Page;
