import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

const BottomBar = () => {
  return (
    <AppBar position="static" color="primary" className="mt-5">
      <Container maxWidth="xl">
        <Box className="w-full flex flex-wrap gap-14 py-10">
          <Box className="flex flex-1 flex-wrap gap-14"></Box>
          <Box className="flex flex-1 flex-wrap gap-14"></Box>
          <Box className="flex flex-1 flex-wrap gap-14"></Box>
        </Box>
      </Container>
    </AppBar>
  );
};

export { BottomBar };
