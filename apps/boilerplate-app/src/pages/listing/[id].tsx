import {
  FavoriteBorder,
  FilterAltOff,
  FilterList,
  Flag,
  LocalMall,
  LocalOffer,
  Padding,
  Report,
  Share,
  ShoppingBasket,
} from '@mui/icons-material';
import { Home as HomeIcon } from '@mui/icons-material'; // useless I guess
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import { Autocomplete, Button, Container, IconButton, Paper, Slider, TextField, Typography } from '@mui/material';
import { Rating } from '@mui/material';
import { useRouter } from 'next/router';

import { Listings } from 'modules';
import { ServiceBayLogo } from 'modules/ServiceBayLogo';
import Home from 'pages';

const Page = () => {
  const router = useRouter();
  return (
    <>
      <Box className="banner static-beach_bar">
        <div className="static-beach_bar__waves" />
        <div className="static-beach_bar__sand static-beach_bar__sand--background" />
        <div className="static-beach_bar__sand static-beach_bar__sand--foreground" />
        <Container maxWidth="xl">
          <Box className="w-full h-[130px] flex text-center justify-center items-center">
            <Box className="flex z-10">
              <Typography className="font-bukhari text-[4.5rem] leading-[4.5rem] text-[#121212]">
                {router.query.category ? router.query.category : 'Placeholder'}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" className="pt-10 flex flex-col gap-5">
        <Box>
          <Paper variant="outlined">
            <Grid container>
              <Grid item>
                <img
                  src="https://i.seadn.io/s/raw/files/a7ac74a21c6da5edd7fe1db0b6cf9a57.jpg?auto=format&dpr=1&w=1000"
                  width={300}
                />
              </Grid>
              <Grid item xs={6}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                  }}
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="0xb1053CA73a40d24FDb6A24Cb536651C0A58C4381"
                      secondary="Seller since July 2019"
                    />
                    <Rating name="half-rating-read" defaultValue={4.25} precision={0.25} readOnly size="small" />
                  </ListItemButton>

                  <Divider component="li" variant="inset" />
                  <li>
                    <Typography sx={{ mt: 0.2, ml: 9 }} color="text.secondary" display="block" variant="caption">
                      Published on Dec 4, 2023
                    </Typography>
                  </li>
                  <Divider component="li" />
                  <li>
                    <Typography
                      sx={{ mt: 0.5, ml: 2 }}
                      color="text.secondary"
                      display="block"
                      variant="caption"
                    ></Typography>
                  </li>
                  <Stack direction="row" spacing={0.3} padding={1}>
                    <Chip label="Developer" color="info" size="small" />

                    <Chip label="Design" color="primary" size="small" />
                  </Stack>

                  <ListItem>
                    <ListItemText primaryTypographyProps={{ fontSize: '36px' }} primary="UI Designer" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Description" secondary="My mom says I draw doges pretty well..." />
                  </ListItem>

                  <p></p>
                  <ListItem>
                    <ListItemText primary="0.1 ETH" primaryTypographyProps={{ fontSize: '24px' }} />

                    <Button variant="contained" startIcon={<ShoppingBasket />}>
                      Buy
                    </Button>
                    <Box sx={{ m: 0.5 }} />
                    <Button variant="contained" startIcon={<LocalOffer />} color="secondary">
                      Make an Offer
                    </Button>
                  </ListItem>
                </List>

                <Box></Box>
              </Grid>
              <Box sx={{ m: 15.6 }} />
              <Paper className=" flex-end h-[60px] items-center justify-center gap-3 px-3">
                <Box className="flex flex-h-[300px]"></Box>

                <Typography variant="h6" gutterBottom></Typography>

                <IconButton>
                  <FavoriteBorder />
                </IconButton>
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
                <IconButton aria-label="report">
                  <Flag />
                </IconButton>
              </Paper>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Page;
