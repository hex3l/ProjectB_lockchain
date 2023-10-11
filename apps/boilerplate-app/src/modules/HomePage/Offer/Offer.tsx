import { Paper, Typography } from '@mui/material';

type OfferTypes = {
  description: string;
  title: string;
};

const Offer = ({ description, title }: OfferTypes) => {
  return (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row space-x-4">
          <img src="https://via.placeholder.com/150" alt="offer" style={{ marginRight: 16 }} />
          <div>
            <Typography sx={{ fontWeight: 'bold', marginRight: 16 }}>{title}</Typography>
            <Typography>{description}</Typography>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export { Offer };
