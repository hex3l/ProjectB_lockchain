/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
import { Brush, Camera, Code, Search, ViewQuilt } from '@mui/icons-material';
import { Autocomplete, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { HotPicks } from 'modules/HotPicks';
import { ServiceBayLogo } from 'modules/ServiceBayLogo';
import { useBackendCall } from 'utils/useBackendCall';

// import { Listings } from 'modules';

const Home = () => {
  const backendCall = useBackendCall();
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<
    Array<{
      id: number;
      name: string;
    }>
  >([]);

  const relevantCategories = useMemo(
    () => [
      { label: 'Web Dev', icon: <ViewQuilt />, url: '/listings/Web%20Development', color: '#FFC107' },
      { label: 'Editing', icon: <Camera />, url: '/listings/Editing', color: '#FF0000' },
      {
        label: 'Graphics',
        icon: <Brush />,
        url: '/listings/Graphics',
        color: '#ff359f',
      },
      {
        label: 'Software',
        icon: <Code />,
        url: '/listings/Software',
        color: '#56ff7f',
      },
    ],
    [],
  );

  useEffect(() => {
    (async () => {
      const categories: unknown = await backendCall(`listing/categories`);
      if (categories) {
        const categoriesData = categories as Array<{ id: number; name: string }>;
        setCategories(categoriesData);
      }
    })().catch((err) => {
      console.error(err);
    });
  }, []);

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
                  <TextField
                    placeholder="Write something..."
                    variant="outlined"
                    className="w-full flex-1"
                    value={search}
                    onChange={async (event) => {
                      setSearch(event.target.value);
                    }}
                  />
                </Box>
                <Box className="flex-1 flex flex-col space-y-2">
                  <Typography className="flex-1 font-bold">In which Category?</Typography>
                  <Autocomplete
                    className="flex-1"
                    disablePortal
                    onChange={async (event, option) => {
                      setSelectedCategory(option);
                    }}
                    options={categories.map((el) => el.name)}
                    renderInput={(params) => <TextField {...params} placeholder="CMS development" />}
                  />
                </Box>
                <Box className="flex flex-col space-y-2">
                  <Typography className="flex-1 font-bold"></Typography>
                  <Button
                    variant="contained"
                    className="h-[56px]"
                    href={`/listings/${selectedCategory}${search ? `?search=${search}` : ''}`}
                  >
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
                    href={`${category.url}`}
                  >
                    {category.label}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>
      <HotPicks />
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
