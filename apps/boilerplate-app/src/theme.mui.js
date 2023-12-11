import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffeb3b',
    },
    secondary: {
      main: '#00897b',
    },
    background: {
      default: '#000000',
      paper: '#0c0c0c',
    },
    error: {
      main: '#d50000',
    },
  },
});
