/* eslint-disable prettier/prettier */
import { METHODS } from 'http';

import { Box, Button, Container } from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { OrderDto } from 'dto/OrderDto';
import { useBackendCall } from 'utils/useBackendCall';

// eslint-disable-next-line import/no-default-export
const Page = () => {
  const backendCall = useBackendCall();
  const [offerInfo, setOfferInfo] = useState<Array<OrderDto> | undefined>(undefined);

  useEffect(() => {
    backendCall('order')
      .then((offers) => {
        setOfferInfo(offers as Array<OrderDto>);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
      <Container maxWidth="xl" className="pt-5 flex flex-col gap-5">
        <Box className="flex flex-row gap-5">
          <Box className="h-full flex-col" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box className="w-[250px]" />
          </Box>
          <Box className="flex flex-wrap flex-row gap-5 justify-evenly">
            {offerInfo?.map(({ id, ...offerInfo }) => (
              <Fragment key={id}>
                <Box className="flex flex-col gap-3">
                  <Box className="flex flex-row gap-3">
                    <img src={offerInfo.image} alt={offerInfo.title} className="w-[100px] h-[100px]" />
                    <Box className="flex flex-col gap-3">
                      <Box className="text-lg font-bold">{offerInfo.title}</Box>
                      <Box className="text-sm">{offerInfo.description}</Box>
                      <Box className="text-sm">{offerInfo.price}</Box>
                      {offerInfo.status === 0 ? (
                        <Button onClick={() => acceptOffer(id)}>Accept</Button>
                      ) : (
                        <Box>Accepted</Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Fragment>
            ))}
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default Page;
