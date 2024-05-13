/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box, Button, Container, Tab, Tabs } from '@mui/material';
import router from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { OrderDto } from 'dto/OrderDto';
import { useBackendCall } from 'utils/useBackendCall';

// eslint-disable-next-line import/no-default-export
const Page = () => {
  const backendCall = useBackendCall();
  const [offerInfo, setOfferInfo] = useState<Array<OrderDto> | undefined>(undefined);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    void (async () => {
      const result = (await backendCall('order', {
        method: 'POST',
        body: JSON.stringify({ filter: value }),
      })) as Array<OrderDto>;
      setOfferInfo(result);
    })();
  }, [value]);

  const acceptOffer = useCallback(
    (id: number) => {
      backendCall('order/confirm', {
        method: 'POST',
        body: JSON.stringify({
          id,
        }),
      })
        .then((offers) => {
          setOfferInfo(offers as Array<OrderDto>);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [offerInfo, backendCall],
  );

  return (
    <Fragment>
      <Box className="banner static-beach_bar">
        <div className="static-beach_bar__waves" />
        <div className="static-beach_bar__sand static-beach_bar__sand--background" />
        <div className="static-beach_bar__sand static-beach_bar__sand--foreground" />
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
          <Tab icon={<MonetizationOnIcon />} label="Offers" />
          <Tab icon={<CheckCircleIcon />} label="Confirmed" />
          <Tab icon={<DisabledByDefaultIcon />} label="Rejected" />
        </Tabs>
      </Box>
      <Container maxWidth="xl" className="pt-5 flex flex-col gap-5">
        <Box className="flex flex-row gap-5">
          <Box className="h-full flex-col" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box className="w-[250px]" />
          </Box>
          <Box className="flex flex-wrap flex-row gap-5 justify-evenly">
            {value === 0 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
                  {offerInfo?.map(({ id, ...offerInfo }) => (
                    <Fragment key={id}>
                      <Box className="w-full flex flex-col gap-3">
                        <Box className="w-full flex flex-row gap-3">
                          <img src={offerInfo.image} alt={offerInfo.title} className="w-[100px] h-[100px]" />
                          <Box className="w-full flex flex-col gap-3">
                            <Box className="text-lg font-bold">{offerInfo.title}</Box>
                            <Box className="text-sm">{offerInfo.description}</Box>
                            <Box className="text-sm text-yellow-300">Price offered: {offerInfo.price} ETH</Box>
                            <Button onClick={() => acceptOffer(id)}>Accept</Button>
                            <Button onClick={() => acceptOffer(id)}>Refuse</Button>
                          </Box>
                        </Box>
                      </Box>
                    </Fragment>
                  ))}
                </Box>
              </Box>
            )}
            {value === 1 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
                  {offerInfo?.map(({ id, ...offerInfo }) => (
                    <Fragment key={id}>
                      <Box className="flex flex-col gap-3">
                        <Box className="flex flex-row gap-3">
                          <img src={offerInfo.image} alt={offerInfo.title} className="w-[100px] h-[100px]" />
                          <Box className="flex flex-col gap-3">
                            <Box className="text-lg font-bold">{offerInfo.title}</Box>
                            <Box className="text-sm">{offerInfo.description}</Box>
                            <Box className="text-sm">{offerInfo.price}</Box>
                            {/*
                      <Chip
                  className="hidden md:flex"
                  color={
                    OrderStatusColors[offerInfo.status as keyof typeof OrderStatusFromNumber] as
                      | 'default'
                      | 'success'
                      | 'warning'
                      | 'error'
                      | 'primary'
                      | 'secondary'
                      | 'info'
                  }
                  label={OrderStatusName[offerInfo.status as keyof typeof OrderStatusFromNumber].toUpperCase()}
                />*/}
                            <Button onClick={() => router.push(`/chat/${id}`)}>chat</Button>
                          </Box>
                        </Box>
                      </Box>
                    </Fragment>
                  ))}
                </Box>
              </Box>
            )}
            {value === 2 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ justifyContent: 'center' }} className="flex flex-wrap flex-row gap-5 justify-center">
                  {offerInfo?.map(({ id, ...offerInfo }) => (
                    <Fragment key={id}>
                      <Box className="flex flex-col gap-3">
                        <Box className="flex flex-row gap-3">
                          <img src={offerInfo.image} alt={offerInfo.title} className="w-[100px] h-[100px]" />
                          <Box className="flex flex-col gap-3">
                            <Box className="text-lg font-bold">{offerInfo.title}</Box>
                            <Box className="text-sm">{offerInfo.description}</Box>
                            <Box className="text-sm">{offerInfo.price}</Box>
                            <Box className="text-sm text-red-700">Rejected</Box>
                          </Box>
                        </Box>
                      </Box>
                    </Fragment>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default Page;
