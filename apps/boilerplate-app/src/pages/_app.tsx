/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';
import { WagmiProvider } from 'wagmi';

import { BottomBar } from 'modules/BarBottom';
import { TopBar } from 'modules/BarTop';
import { ListingDialog } from 'modules/Listing/ListingDialog';
import { theme } from 'theme.mui';
import { GlobalStateProvider } from 'utils/GlobalState';
import 'common/styles/global.css';
import { wagmiConfig } from 'utils/wagmiConfig';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  const token = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    } else return false;
  }, []);

  return (
    <GlobalStateProvider>
      <WagmiProvider config={wagmiConfig} reconnectOnMount={!!token}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Head>
              <title>ServiceBay</title>
              <meta name="description" content="Servicebay" />
              <meta name="version" content="1.0.0" />
              <link rel="icon" href="/favicon.ico" />
              <style>{`
              body,
              body > div:first-child,
              div#__next,
              div#__next > div {
                height: 100%;
              }
            `}</style>
            </Head>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <Box className="h-full overflow-auto">
                <TopBar />
                <div className="md:h-[68px] sm:h-[63px] h-[55px]" />
                <Component {...pageProps} />
                <ListingDialog />
                <BottomBar />
              </Box>
            </SnackbarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </GlobalStateProvider>
  );
};

export default App;
