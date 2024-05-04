/* eslint-disable @typescript-eslint/restrict-template-expressions */
import FavoriteIcon from '@mui/icons-material/Favorite';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Avatar, Box, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import React from 'react';
import { useAccount } from 'wagmi';

import { ListingDto } from 'dto/ListingDto';
import { OfferRow } from 'modules/Listings/OfferRow';
import { useBackendCall } from 'utils/useBackendCall';

const Page = () => {
  const backendCall = useBackendCall();
  const [listingsFav, setListingsFav] = useState<Array<ListingDto>>([]);
  const [listingsMy, setListingsMy] = useState<Array<ListingDto>>([]);
  const [purchased, setPurchased] = useState<Array<ListingDto>>([]);
  const { address } = useAccount();
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    (async () => {
      const favorites = (await backendCall(`user/favorites`)) as Array<ListingDto>;
      setListingsFav(favorites);
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (address) {
        const queryParams: Record<string, string> = {
          take: '10',
          page: '1',
        };
        queryParams.address = address;
        const my = (await backendCall(`listing?${new URLSearchParams(queryParams)}`, {})) as Array<ListingDto>;
        console.log(my);
        setListingsMy(my);
      }
    })().catch((err) => {
      console.error(err);
    });
  }, [address, backendCall]);

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
      <Box>
        {value === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
              {purchased.map(({ id, ...listing }) => (
                <Fragment key={id}>
                  <OfferRow {...{ id, ...listing }} />
                </Fragment>
              ))}
            </Box>
          </Box>
        )}
        {value === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
              {listingsFav.map(({ id, ...listing }) => (
                <Fragment key={id}>
                  <OfferRow {...{ id, ...listing }} />
                </Fragment>
              ))}
            </Box>
          </Box>
        )}
        {value === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
              {listingsMy.map(({ id, ...listing }) => (
                <Fragment key={id}>
                  <OfferRow {...{ id, ...listing }} />
                </Fragment>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Page;
