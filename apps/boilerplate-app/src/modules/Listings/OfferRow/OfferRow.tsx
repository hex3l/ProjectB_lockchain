import { FavoriteBorder } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';

type OfferTypes = {
  description: string;
  title: string;
};

const OfferRow = ({ description, title }: OfferTypes) => {
  return (
    <Paper className="flex flex-row space-x-5" sx={{ p: '10px', display: 'flex', width: '100%', height: '150px' }}>
      <img src="https://via.placeholder.com/150" alt="offer" width={280} height={130} />
      <Box className="flex-1" sx={{ pt: 0.5 }}>
        <Typography sx={{ fontWeight: 'bold', marginRight: 16 }}>{title}</Typography>
        <Typography>{description.length > 250 ? `${description.slice(0, 65)}...` : description}</Typography>
      </Box>
      <Box className="flex flex-col items-end">
        <Box className="flex-1">
          <IconButton>
            <FavoriteBorder></FavoriteBorder>
          </IconButton>
        </Box>
        <Box className="flex flex-row space-x-2 items-center">
          <Typography className="font-bold">0.1 ETH</Typography>
          <Button variant="contained">Buy now</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export { OfferRow };
