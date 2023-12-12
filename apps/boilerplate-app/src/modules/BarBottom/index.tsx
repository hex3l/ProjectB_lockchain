import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

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
