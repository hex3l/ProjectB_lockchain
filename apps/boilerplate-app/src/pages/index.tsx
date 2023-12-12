import {
  Brush,
  Camera,
  Code,
  Search,
  ShowChart,
  ShowChartOutlined,
  ViewQuilt,
  WhatshotOutlined,
} from '@mui/icons-material';
import { Autocomplete, Box, Button, Container, Paper, Skeleton, TextField, Typography } from '@mui/material';
import { useMemo } from 'react';

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
      <Box className="banner">
        <Container maxWidth="xl">
          <Box className="w-full h-[500px] flex flex-col space-y-2 text-center justify-center items-center">
            <Paper className="w-[700px] p-5 shadow-2xl">
              <Box className="flex flex-row space-x-4 text-left">
                <Box className="flex-1 flex flex-col space-y-2">
                  <Typography className="flex-1 font-bold">What are you looking for?</Typography>
                  <TextField label="Outlined" variant="outlined" className="w-full flex-1" />
                </Box>
                <Box className="flex-1 flex flex-col space-y-2">
                  <Typography className="flex-1 font-bold">In which Category?</Typography>
                  <Autocomplete
                    className="flex-1"
                    disablePortal
                    options={['Option 1', 'Option 2']}
                    renderInput={(params) => <TextField {...params} label="Combo box" />}
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
            <Box className="w-[700px] flex flex-row space-x-4">
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
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((v) => (
              <div>
                <Skeleton variant="rectangular" width={280} height={160} />
                <Box sx={{ pt: 0.5 }}>
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>
              </div>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;
