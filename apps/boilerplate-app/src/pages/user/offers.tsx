/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { OrderDto } from 'dto/OrderDto';
import { OfferStatusRow } from 'modules/Listings/OfferStatusRow';
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
      <Container fixed>
        <Box sx={{ bgcolor: '#1c1c1c', borderRadius: '16px', margin: '15px 0' }}>
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
        <Box className="flex flex-row gap-5">
          <Box className="flex flex-wrap w-full flex-row gap-5 justify-evenly">
            {value === 0 &&
              offerInfo?.map(({ id, ...offerInfo }) => (
                <Fragment key={id}>
                  <OfferStatusRow {...{ id, ...offerInfo }} acceptOffer={acceptOffer} />
                </Fragment>
              ))}
            {value === 1 &&
              offerInfo?.map(({ id, ...offerInfo }) => (
                <Fragment key={id}>
                  <OfferStatusRow {...{ id, ...offerInfo }} />
                </Fragment>
              ))}
            {value === 2 &&
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
