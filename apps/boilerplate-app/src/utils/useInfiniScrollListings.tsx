/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Box, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ListingDto } from 'dto/ListingDto';

import { useBackendCall } from './useBackendCall';
import { useOnScreen } from './useOnScreen';

const maxItems = 5;

export const useInfiniScrollListings = ({
  search,
  category,
  lowerPrice,
  higherPrice,
  orderByDirection,
  orderByType,
  myorders,
  favorite,
  address,
  states,
}: {
  search?: string | undefined | null;
  category?: string | undefined | null;
  lowerPrice?: number;
  higherPrice?: number;
  orderByDirection?: 'ASC' | 'DESC';
  orderByType?: string;
  myorders?: boolean;
  favorite?: boolean;
  address?: string;
  states?: string;
}) => {
  const backendCall = useBackendCall();
  const [listings, setListings] = useState<Array<ListingDto> | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const [page, setPage] = useState<number>(1);
  const [end, setEnd] = useState<boolean>(false);

  const pullListings = useCallback(
    async (page: number, append: boolean) => {
      const queryParams: Record<string, string> = {
        take: maxItems.toString(),
        page: page.toString(),
      };
      if (search) queryParams.search = search;
      if (category) queryParams.category = category;
      if (lowerPrice) queryParams.lowerPrice = lowerPrice.toString();
      if (higherPrice) queryParams.higherPrice = higherPrice.toString();
      if (orderByDirection) queryParams.orderByDirection = orderByDirection;
      if (orderByType) queryParams.orderByType = orderByType;
      if (myorders) queryParams.myorders = myorders.toString();
      if (favorite) queryParams.favorite = favorite.toString();
      if (address) queryParams.address = address;
      if (states) queryParams.states = states;
      const dbList = (await backendCall(`listing?${new URLSearchParams(queryParams)}`, {})) as
        | Array<ListingDto>
        | undefined;
      console.log('dbList', dbList);
      if (dbList && dbList.length > 0) {
        if (!append) setListings(dbList);
        else {
          setListings([...(listings ?? []), ...dbList]);
        }
        if (dbList.length < maxItems) setEnd(true);
      } else {
        setEnd(true);
      }
    },
    [search, category, lowerPrice, higherPrice, orderByDirection, orderByType, myorders, favorite, address, listings],
  );

  useEffect(() => {
    setListings(undefined);
    setEnd(false);
    setPage(0);
  }, [search, category, lowerPrice, higherPrice, orderByDirection, orderByType, myorders, favorite, address]); // usare questo se cambiano i parametri di ricerca

  useEffect(() => {
    const visible = setTimeout(async () => {
      if (isVisible && !end) {
        await pullListings(page + 1, true);
        setPage(page + 1);
      }
    }, 500);
    return () => clearTimeout(visible);
  }, [isVisible]); // usare questo se si vuole pullare una nuova pagina

  const PullListings = useMemo(() => {
    return () => (
      <Box ref={ref} className="flex flex-row items-center">
        {end ? 'No more listings to show' : <CircularProgress />}
      </Box>
    );
  }, [ref, end]);

  return { listings, end, PullListings };
};
