import { FavoriteBorder } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
type OfferTypes = {
  id: string;
  description: string;
  name: string;
  image: string;
  price: string;
};

const OfferRow = ({ id, description, name, image, price }: OfferTypes) => {
  return (
    <Paper className="flex flex-row space-x-5 p-5" sx={{ p: '10px', width: '100%', minWidth: 0, height: '180px' }}>
      <img src={image} alt="offer" className="md:max-w-[260px] max-h-full" />
      <Box className="flex flex-col flex-1">
        <Box className="flex flex-row">
          <Box className="flex-1">
            <Typography sx={{ fontWeight: 'bold' }}>{name}</Typography>
          </Box>
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
            <Button href={`/listing/${id}`} variant="contained" className="md:flex hidden">
              View more
            </Button>
            <Button href={`/listing/${id}`} variant="contained" className="flex md:hidden">
              Open
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export { OfferRow };
