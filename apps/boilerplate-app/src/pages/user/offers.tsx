/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */
import { LocalOffer } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box, Button, Container, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { OrderDto } from 'dto/OrderDto';
import { OfferStatusRow } from 'modules/Listings/OfferStatusRow';
import { MyListings } from 'modules/UserLists';
import { useBackendCall } from 'utils/useBackendCall';

// eslint-disable-next-line import/no-default-export
const Page = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const backendCall = useBackendCall();
  const [offerInfo, setOfferInfo] = useState<Array<OrderDto> | undefined>(undefined);
  const [value, setValue] = useState(0);
  const [filter, setFilter] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) setFilter(0);
    if (newValue === 2) setFilter(1);
    if (newValue === 3) setFilter(100);
    setValue(newValue);
  };

  useEffect(() => {
    void (async () => {
      console.log('Filter', filter);

      const result = (await backendCall('order', {
        method: 'POST',
        body: JSON.stringify({ filter: filter }),
      })) as Array<OrderDto>;
      setOfferInfo(result);
    })();
  }, [filter]);

  const acceptOffer = useCallback(
    (id: number) => {
      backendCall('order/confirm', {
        method: 'POST',
        body: JSON.stringify({
          id,
        }),
      })
        .then(async () => {
          const result = (await backendCall('order', {
            method: 'POST',
            body: JSON.stringify({ filter: filter }),
          })) as Array<OrderDto>;
          setOfferInfo(result);
          enqueueSnackbar('Offer accepted', { variant: 'success' });
        })
        .catch((error: any) => {
          console.error(error);
        });
    },
    [backendCall, filter, enqueueSnackbar],
  );

  const refuseOffer = useCallback(
    (id: number) => {
      backendCall('order/reject', {
        method: 'POST',
        body: JSON.stringify({
          id,
        }),
      })
        .then(async () => {
          const result = (await backendCall('order', {
            method: 'POST',
            body: JSON.stringify({ filter: filter }),
          })) as Array<OrderDto>;
          setOfferInfo(result);
          enqueueSnackbar('Offer rejected', { variant: 'success' });
        })
        .catch((error: any) => {
          console.error(error);
        });
    },
    [backendCall, filter, enqueueSnackbar],
  );

  // ///////////////////////////////////////////////////////////////
  // Handle sticky sidebar
  const [topbarTop, setTopbarTop] = useState<number | undefined>(undefined);
  const [topbarWidth, setTopbarWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const topbar = document.querySelector('.topbar')?.getBoundingClientRect();
    setTopbarTop(topbar?.top ?? undefined);
    setTopbarWidth(topbar?.width ?? undefined);
  }, []);

  const isStickyTopbar = () => {
    const sidebar = document.querySelector('.topbar');
    const scrollTop = window.scrollY;
    if (scrollTop >= (topbarTop ?? 0) - 68) {
      sidebar?.classList.add('is-sticky-topbar');
    } else {
      sidebar?.classList.remove('is-sticky-topbar');
    }
  };

  useEffect(() => {
    if (!topbarTop) return;

    window.addEventListener('scroll', isStickyTopbar);
    return () => {
      window.removeEventListener('scroll', isStickyTopbar);
    };
  }, [topbarTop]);

  return (
    <Fragment>
      <Box className="banner static-beach_bar">
        <div className="static-beach_bar__waves" />
        <div className="static-beach_bar__sand static-beach_bar__sand--background" />
        <div className="static-beach_bar__sand static-beach_bar__sand--foreground" />
        <Container maxWidth="xl">
          <Box className="w-full h-[200px] flex flex-col text-center justify-center items-center">
            <Box className="flex z-10">
              <Typography className="font-bukhari md:text-[4.5rem] md:leading-[4.5rem] text-[2.5rem] leading-[2.5rem] text-[#121212]">
                Manage your listings
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container fixed>
        <Box className="flex flex-row">
          <Box className="h-[80px]" />
          <Box
            className="topbar flex flex-col md:flex-row gap-5 py-5"
            sx={{ width: topbarWidth ? `${topbarWidth}px !important` : '100%' }}
          >
            <Paper className="flex-1 flex-col md:flex-row flex h-[60px] items-center justify-center">
              <Box className="hidden md:flex flex-row flex-1"></Box>
              <Box sx={{ bgcolor: '#1c1c1c', borderRadius: '16px', margin: '15px 0' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="icon label tabs flex"
                  centered
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab className="flex-1" icon={<LocalOffer />} label="My listings" />
                  <Tab icon={<MonetizationOnIcon />} label="Offers" />
                  <Tab icon={<CheckCircleIcon />} label="Confirmed" />
                  <Tab icon={<DisabledByDefaultIcon />} label="Rejected" />
                </Tabs>
              </Box>
              <Box className="flex flex-row md:flex-1 justify-center">
                <Box className="p-3">
                  <Button variant="contained" color="primary" onClick={() => router.push(`/listing/create`)}>
                    Create new
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
        <Box className="flex flex-row gap-5">
          <Box className="flex flex-wrap w-full flex-row gap-5 justify-evenly">
            {value === 0 && <MyListings />}
            {value === 1 &&
              offerInfo?.map(({ id, ...offerInfo }) => (
                <Fragment key={id}>
                  <OfferStatusRow {...{ id, ...offerInfo }} acceptOffer={acceptOffer} refuseOffer={refuseOffer} />
                </Fragment>
              ))}
            {value === 2 &&
              offerInfo?.map(({ id, ...offerInfo }) => (
                <Fragment key={id}>
                  <OfferStatusRow {...{ id, ...offerInfo }} />
                </Fragment>
              ))}
            {value === 3 &&
              offerInfo?.map(({ id, ...offerInfo }) => (
                <Fragment key={id}>
                  <OfferStatusRow {...{ id, ...offerInfo }} />
                </Fragment>
              ))}
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default Page;
