/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { RefObject, useCallback, useEffect, useState } from 'react';

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
  scroller,
}: {
  search: string | undefined | null;
  category: string | undefined | null;
  lowerPrice?: number;
  higherPrice?: number;
  orderByDirection?: 'ASC' | 'DESC';
  orderByType?: string;
  scroller: RefObject<HTMLElement>;
}) => {
  const backendCall = useBackendCall();
  const [listings, setListings] = useState<Array<ListingDto> | undefined>(undefined);
  const isVisible = useOnScreen(scroller);
  const [page, setPage] = useState<number>(1);
  const [loadedFirstPage, setLoadedFirstPage] = useState<boolean>(false);
  const [end, setEnd] = useState<boolean>(false);

  const pullListings = useCallback(
    async (page: number, append: boolean) => {
      if (search !== undefined && category !== undefined) {
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
        const dbList = (await backendCall(`listing?${new URLSearchParams(queryParams)}`, {})) as
          | Array<ListingDto>
          | undefined;

        if (dbList && dbList.length > 0) {
          if (!append) setListings(dbList);
          else {
            setListings([...(listings ?? []), ...dbList]);
          }
          if (dbList.length < maxItems) setEnd(true);
        } else {
          setEnd(true);
        }
      }
    },
    [search, category, lowerPrice, higherPrice, orderByDirection, orderByType, listings],
  );

  useEffect(() => {
    (async () => {
      setLoadedFirstPage(false);
      setListings(undefined);
      setEnd(false);
      setPage(1);
      if (search !== undefined && category !== undefined) {
        await pullListings(1, false);
        setLoadedFirstPage(true);
      }
    })().catch((err) => {
      console.error(err);
    });
  }, [search, category, lowerPrice, higherPrice, orderByDirection, orderByType]); // usare questo se cambiano i parametri di ricerca

  useEffect(() => {
    const visible = setTimeout(async () => {
      if (isVisible && !end && loadedFirstPage) {
        await pullListings(page + 1, true);
        setPage(page + 1);
      }
    }, 600);
    return () => clearTimeout(visible);
  }, [isVisible]); // usare questo se si vuole pullare una nuova pagina

  return { listings, end };
};
