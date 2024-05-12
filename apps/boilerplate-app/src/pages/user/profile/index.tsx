/* eslint-disable @typescript-eslint/restrict-template-expressions */
import FavoriteIcon from '@mui/icons-material/Favorite';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Avatar, Box, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import React from 'react';
import { useAccount } from 'wagmi';

import { MyFavorites, MyOrders, MyListings } from 'modules/UserLists';

const Page = () => {
  const { address } = useAccount();
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container fixed>
      <Box className="flex flex-row gap-3 pt-3">
        <Avatar sx={{ width: 96, height: 96 }} />
        <Box className="flex flex-col md:flex-none flex-1 justify-center">
          <Typography>{address}</Typography>
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
      <Box sx={{ p: 3 }}>
        {value === 0 && <MyOrders />}
        {value === 1 && <MyFavorites />}
        {value === 2 && <MyListings />}
      </Box>
    </Container>
  );
};

export default Page;
