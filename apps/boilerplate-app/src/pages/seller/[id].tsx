/* eslint-disable import/order */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import { FavoriteBorder, Flag, LocalOffer, Share, ShoppingBasket } from '@mui/icons-material';
import { Avatar, Box, Chip, Divider, Stack } from '@mui/material';
import { Button, Container, IconButton, Paper, Typography } from '@mui/material';
import { Rating } from '@mui/material';
import { useRouter } from 'next/router';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import listings from '../../common/listings.json';

import { useMemo } from 'react';
import React from 'react';

const Page = () => {
  const router = useRouter();

  const listing = useMemo(() => {
    const { id } = router.query;
    const listing = listings.find((listing) => listing.id === id);

    return listing;
  }, [router.query.id]);

  return (
    <>
      <Container maxWidth="xl" className="pt-10 pb-10 flex flex-col gap-5">
        <Box>
          <Paper variant="outlined">
            <Box className="flex md:flex-row flex-col">
              <Box className="flex flex-col items-center">
                <Box className="md:w-[300px] md:h-[300px] w-[300px] h-[300px] p-10 flex flex-col">
                  <Avatar className="w-full h-full m-auto" />
                </Box>
              </Box>
              <Box className="flex flex-1 flex-col gap-1 pb-5 pl-5">
                <Box className="flex flex-row">
                  <Stack direction="row" spacing={1} className="flex-1 pt-5"></Stack>
                  <Paper className="flex flex-end items-center h-[60px] justify-center gap-1 px-3">
                    <IconButton aria-label="share">
                      <Share />
                    </IconButton>
                    <IconButton aria-label="report">
                      <Flag />
                    </IconButton>
                  </Paper>
                </Box>
                <Box className="flex flex-col flex-1 pr-5 gap-1 ">
                  <Typography sx={{ fontSize: '32px' }}>{'0xb1053CA73a40d24FDb6A24Cb536651C0A58C4381'}</Typography>
                  <Rating name="half-rating-read" defaultValue={4.25} precision={0.25} readOnly size="medium" />
                  <Divider className="p-2" />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
      <Box className="banner static-beach_bar">
        <div className="static-beach_bar__waves" />
        <div className="static-beach_bar__sand static-beach_bar__sand--background" />
        <div className="static-beach_bar__sand static-beach_bar__sand--foreground" />
        <Container maxWidth="xl">
          <Box className="w-full h-[130px] flex text-center justify-center items-center">
            <Box className="flex z-10">
              <Typography className="font-bukhari md:text-[4.5rem] text-[2.5rem] leading-[2.5rem] text-[#121212]">
                Check out other listings
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
