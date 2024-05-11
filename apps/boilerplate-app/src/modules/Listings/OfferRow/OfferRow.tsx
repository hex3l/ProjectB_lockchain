/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { FavoriteBorder } from '@mui/icons-material';
import { Box, Button, Chip, IconButton, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { ListingStatus, ListingStatusColors } from 'common/consts/listing-status.enum';
import { ListingDto } from 'dto/ListingDto';
import { addQueryParams } from 'modules/utils';

const OfferRow = ({
  id,
  description,
  title,
  image,
  price,
  status,
  showStatus,
}: ListingDto & { showStatus?: boolean }) => {
  const router = useRouter();

  return (
    <Paper className="flex flex-row space-x-5 p-5" sx={{ p: '10px', width: '100%', minWidth: 0, height: '180px' }}>
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
          <IconButton>
            <FavoriteBorder></FavoriteBorder>
          </IconButton>
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
