import { Box, Button, Paper, Typography } from '@mui/material';

type OfferTypes = {
  id: string;
  description: string;
  name: string;
  image: string;
  price: string;
};

const Offer = ({ id, description, name, image, price }: OfferTypes) => {
  return (
    <Paper
      className="flex flex-col"
      sx={{ p: '7px', display: 'flex', alignItems: 'center', width: '300px', height: '430px' }}
    >
      <img src={image} alt="offer" width={285} height={285} />
      <Box sx={{ pt: 0.5 }} className="flex-1">
        <Typography sx={{ fontWeight: 'bold', marginRight: 16 }}>{name}</Typography>
        <Typography>{description.length > 65 ? `${description.slice(0, 65)}...` : description}</Typography>
      </Box>
      <Box className="flex flex-row gap-2 items-center w-full">
        <Box className="flex-1">
          <Typography className="flex flex-1 font-bold  justify-end">{price} ETH</Typography>
        </Box>
        <Button href={`/listing/${id}`} variant="contained" className="md:flex hidden">
          View more
        </Button>
        <Button href={`/listing/${id}`} variant="contained" className="flex md:hidden">
          Open
        </Button>
      </Box>
    </Paper>
  );
};

export { Offer };
