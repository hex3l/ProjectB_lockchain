/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { FavoriteBorder } from '@mui/icons-material';
import Favorite from '@mui/icons-material/Favorite';
import { Box, Button, Chip, IconButton, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ListingStatus, ListingStatusColors } from 'common/consts/listing-status.enum';
import { ListingDto } from 'dto/ListingDto';
import { addQueryParams } from 'modules/utils';
import { useBackendCall } from 'utils/useBackendCall';

const OfferRow = ({
  id,
  description,
  title,
  image,
  price,
  status,
  favorites,
  showStatus,
}: ListingDto & { showStatus?: boolean; favorites?: Array<{ id: number }> }) => {
  const router = useRouter();
  const backendCall = useBackendCall();
  const [localFavorite, setLocalFavorite] = useState<boolean>(!!favorites && favorites.length > 0);
  const ref = useRef<HTMLDivElement>(null);

  const favorite = useCallback(async () => {
    const data: unknown = await backendCall(`user/favorite`, {
      method: 'POST',
      body: JSON.stringify({ listing_id: id }),
    });
    if (data !== undefined) {
      setLocalFavorite((data as { favorite: boolean }).favorite);
    }
  }, [backendCall, id]);

  useEffect(() => {
    const tmo = setTimeout(() => {
      if (ref.current) ref.current.classList.remove('opacity-0');
    }, 200);
    return () => clearTimeout(tmo);
  }, [ref.current]);

  return (
    <Paper
      ref={ref}
      className="flex flex-row space-x-5 p-5 transition-all opacity-0"
      sx={{ p: '10px', width: '100%', minWidth: 0, height: '180px' }}
    >
      <img src={image} alt="offer" className="md:max-w-[260px] max-h-full" />
      <Box className="flex flex-col flex-1">
        <Box className="flex flex-row items-center">
          <Box className="flex-1">
            <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
          </Box>
          {showStatus && (
            <Chip
              color={
                ListingStatusColors[status as keyof typeof ListingStatus] as
                  | 'default'
                  | 'success'
                  | 'warning'
                  | 'error'
                  | 'primary'
                  | 'secondary'
                  | 'info'
              }
              label={ListingStatus[status as keyof typeof ListingStatus].toUpperCase()}
            />
          )}
          <IconButton onClick={() => favorite()}>{localFavorite ? <Favorite /> : <FavoriteBorder />}</IconButton>
        </Box>

        <Box className="flex-1" sx={{ pt: 0.5 }}>
          <Typography className="hidden md:flex">
            {description.length > 250 ? `${description.slice(0, 250)}...` : description}
          </Typography>
        </Box>

        <Box className="flex flex-col items-end">
          <Box className="flex-1" />
          <Box className="flex flex-row space-x-2 items-center">
            <Typography className="font-bold">{price} ETH</Typography>
            <Button
              variant="contained"
              className="md:flex hidden"
              onClick={() => addQueryParams(router, 'listing', `${id}`)}
            >
              View more
            </Button>
            <Button
              variant="contained"
              className="flex md:hidden"
              onClick={() => addQueryParams(router, 'listing', `${id}`)}
            >
              Open
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export { OfferRow };
