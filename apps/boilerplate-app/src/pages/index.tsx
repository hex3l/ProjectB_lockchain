import { Brush, Camera, Code, Search, ViewQuilt, WhatshotOutlined } from '@mui/icons-material';
import { Autocomplete, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useMemo } from 'react';

import { Offer } from 'modules/Listings/OfferBox';
import { ServiceBayLogo } from 'modules/ServiceBayLogo';

// import { Listings } from 'modules';

const Home = () => {
  const relevantCategories = useMemo(
    () => [
      { label: 'Web Dev', icon: <ViewQuilt />, url: '/listings/web-design', color: '#FFC107' },
      { label: 'Editing', icon: <Camera />, url: '/listings/editing', color: '#FF0000' },
      {
        label: 'Graphics',
        icon: <Brush />,
        url: '/listings/web-development',
        color: '#ff359f',
      },
      {
        label: 'Software',
        icon: <Code />,
        url: '/listings/web-development',
        color: '#56ff7f',
      },
    ],
    [],
  );

  return (
    <>
      <Box className="banner beach">
        <div className="beach__waves" />
        <div className="beach__sand beach__sand--background" />
        <div className="beach__sand beach__sand--foreground" />
        <Container maxWidth="xl">
          <Box className="w-full h-[600px] flex flex-col space-y-2 text-center justify-center items-center">
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Box className="flex flex-row items-center space-x-2 translate-x-10 translate-y-[-30px] z-[1000]">
                <ServiceBayLogo sx={{ height: '300px', minHeight: '300px' }}></ServiceBayLogo>
                <Box className="rotate-[-12deg] translate-x-[-100px] translate-y-[-30px]">
                  <Typography className="font-bukhari text-[4.5rem] leading-[4.5rem]">
                    Service
                    <br />
                    Bay
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Box className="flex flex-row items-center space-x-2 translate-x-8 translate-y-[-20px] z-[1000]">
                <ServiceBayLogo
                  sx={{ height: '200px', minHeight: '200px' }}
                  overrideHeight={'200px'}
                  overrideWidth={'200px'}
                ></ServiceBayLogo>
                <Box className="rotate-[-12deg] translate-x-[-70px] translate-y-[-30px]">
                  <Typography className="font-bukhari text-[3.5rem] leading-[3.5rem]">
                    Service
                    <br />
                    Bay
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Paper className="max-w-[700px] p-5 shadow-2xl z-[1000]">
              <Box className="flex flex-col gap-3 justify-evenly text-left md:flex-row md:w-[660px]">
                <Box className="flex-1 flex flex-col space-y-2">
                  <Typography className="flex-1 font-bold">What are you looking for?</Typography>
                  <TextField placeholder="Wordpress plugin" variant="outlined" className="w-full flex-1" />
                </Box>
                <Box className="flex-1 flex flex-col space-y-2">
                  <Typography className="flex-1 font-bold">In which Category?</Typography>
                  <Autocomplete
                    className="flex-1"
                    disablePortal
                    options={['Option 1', 'Option 2']}
                    renderInput={(params) => <TextField {...params} placeholder="CMS development" />}
                  />
                </Box>
                <Box className="flex flex-col space-y-2">
                  <Typography className="flex-1 font-bold"></Typography>
                  <Button variant="contained" className="h-[56px]">
                    <Search></Search>
                  </Button>
                </Box>
              </Box>
            </Paper>
            <Box className="w-[700px] hidden md:flex flex-row space-x-4 z-10">
              {relevantCategories.map((category) => {
                return (
                  <Button
                    key={category.label}
                    variant="contained"
                    className="flex-1 h-[56px] shadow-2xl border-solid  border-2 hover:bg-transparent hover:border-white hover:text-[#fff]"
                    startIcon={category.icon}
                    sx={{ color: category.color, backgroundColor: '#181818' }}
                  >
                    {category.label}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>
      <Box className="shadow-s-top w-full">
        <Container maxWidth="xl" className="pt-10">
          <Typography className="flex justify-items-center pb-5 pl-3">
            <WhatshotOutlined className="text-orange-600" /> Currently trending
          </Typography>
          <Box className="flex flex-wrap flex-row gap-10 justify-evenly">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
              <Offer
                key={index}
                description={`Who wants to have a cookout this weekend? I just got some furniture
              for my backyard and would love to fire up the grill.`}
                title={'SummerBBQ'}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
}; /* <div>
<Skeleton variant="rectangular" width={280} height={160} />
<Box sx={{ pt: 0.5 }}>
  <Skeleton />
  <Skeleton width="60%" />
</Box>
</div>*/

export default Home;
