/* eslint-disable import/order */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import { Box } from '@mui/material';
import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import 'react-slideshow-image/dist/styles.css';

import { HotPicks } from 'modules/HotPicks';
import { Listing } from 'modules/Listing';

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  const id_listing = parseInt(Array.isArray(id) ? id[0] ?? '0' : id ?? '0', 10);

  return (
    <>
      <Listing id_listing={id_listing} />
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

      <HotPicks />
    </>
  );
};

export default Page;
