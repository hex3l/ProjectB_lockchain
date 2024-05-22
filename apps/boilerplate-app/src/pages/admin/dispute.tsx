/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */

import { Container, Box } from '@mui/material';
import { id } from 'date-fns/locale';
import { OrderDto } from 'dto/OrderDto';
import { DisputeStatusRow } from 'modules/Listings/DisputeStatusRow';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useBackendCall } from 'utils/useBackendCall';

// eslint-disable-next-line import/no-default-export
const Page = () => {
  const backendCall = useBackendCall();
  const [offerInfo, setOfferInfo] = useState<Array<OrderDto> | undefined>(undefined);

  useEffect(() => {
    void (async () => {
      const result = (await backendCall('order/dispute', {
        method: 'GET',
      })) as Array<OrderDto>;
      setOfferInfo(result);
    })();
  }, []);

  const payBuyer = useCallback(
    (id: number) => {
      backendCall('order/payBuyer', {
        method: 'POST',
        body: JSON.stringify({ id }),
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

  const paySeller = useCallback(
    (id: number) => {
      backendCall('order/paySeller', {
        method: 'POST',
        body: JSON.stringify({ id }),
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
          {offerInfo?.map(({ id, ...offerInfo }) => (
            <Fragment key={id}>
              <DisputeStatusRow {...{ id, ...offerInfo }} payBuyer={payBuyer} paySeller={paySeller} />
            </Fragment>
          ))}
        </Box>
      </Container>
    </Fragment>
  );
};

export default Page;
