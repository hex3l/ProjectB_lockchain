import { Container, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import { ServiceBayLogo } from 'modules/ServiceBayLogo';

const BottomBar = () => {
  return (
    <AppBar position="static" color="primary" className="mt-5">
      <Container maxWidth="xl">
        <Box className="w-full flex flex-wrap gap-14 py-10">
          <Box className="hidden md:flex  flex-1 flex-col justify-center items-center"></Box>
          <Box className="flex flex-1 flex-wrap justify-center items-center">
            <Box className="flex flex-col justify-center items-center">
              <Box className="flex flex-row items-center z-[1000]">
                <ServiceBayLogo />
                <Box className="rotate-[-12deg] translate-x-[-5px] translate-y-[-5px]">
                  <Typography className="font-bukhari text-[1rem] leading-[1rem]">
                    Service
                    <br />
                    Bay
                  </Typography>
                </Box>
              </Box>
              <Typography className="text-[10px]">Made with ❤️ by NotThePirateBayTeam</Typography>
              <div className="text-[10px]">
                2024<sup>©</sup>
              </div>
            </Box>
          </Box>
          <Box className="hidden md:flex  flex-1 flex-wrap"></Box>
        </Box>
      </Container>
    </AppBar>
  );
};

export { BottomBar };
