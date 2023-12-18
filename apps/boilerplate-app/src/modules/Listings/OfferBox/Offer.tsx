import { Box, Paper, Typography } from '@mui/material';

type OfferTypes = {
  description: string;
  title: string;
};

const Offer = ({ description, title }: OfferTypes) => {
  return (
    <Paper
      className="flex flex-col"
      sx={{ p: '7px', display: 'flex', alignItems: 'center', width: '300px', height: '265px' }}
    >
      <div>
        <img src="https://via.placeholder.com/150" alt="offer" width={285} height={160} />
        <Box sx={{ pt: 0.5 }}>
          <Typography sx={{ fontWeight: 'bold', marginRight: 16 }}>{title}</Typography>
          <Typography>{description.length > 65 ? `${description.slice(0, 65)}...` : description}</Typography>
        </Box>
      </div>
    </Paper>
  );
};

export { Offer };
