/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';
import { localhost } from 'viem/chains';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { BottomBar } from 'modules/BarBottom';
import { TopBar } from 'modules/BarTop';
import { ListingDialog } from 'modules/Listing/ListingDialog';
import { theme } from 'theme.mui';
import { GlobalStateProvider } from 'utils/GlobalState';

import 'common/styles/global.css';

const { chains, publicClient, webSocketPublicClient } = configureChains([localhost], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GlobalStateProvider>
      <WagmiConfig config={config}>
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
      </WagmiConfig>
    </GlobalStateProvider>
  );
};

export default App;
