/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { StarBorder } from '@mui/icons-material';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Avatar, Box, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';

import { UserLisings } from 'modules/UserLists/UserListings';

const Page = () => {
  const router = useRouter();
  const [address, setAddress] = useState<string | null | undefined>(undefined);
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && router.query.id) {
      setAddress(Array.isArray(router.query.id) ? router.query.id[0] : router.query.id ?? null);
    }
  }, [router.query.id]);

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
          <Tab icon={<InventoryIcon />} label="Listings" />
          <Tab icon={<StarBorder />} label="Ratings" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {value === 0 && address && <UserLisings address={address} />}
        {value === 1 && <>Feature coming soon</>}
      </Box>
    </Container>
  );
};

export default Page;
