/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import { localhost } from 'viem/chains';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { BottomBar } from 'modules/BarBottom';
import { TopBar } from 'modules/BarTop';
import { theme } from 'theme.mui';
import { GlobalStateProvider } from 'utils/GlobalState';

import 'common/styles/global.css';

const App = ({ Component, pageProps }: AppProps) => {
  const { chains, publicClient, webSocketPublicClient } = configureChains([localhost], [publicProvider()]);

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });

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
              html,
              body,
              body > div:first-child,
              div#__next,
              div#__next > div {
                height: 100%;
              }
            `}</style>
          </Head>
          <CssBaseline />
          <Box className="h-full overflow-auto">
            <TopBar />
            <Component {...pageProps} />
            <BottomBar />
          </Box>
        </ThemeProvider>
      </WagmiConfig>
    </GlobalStateProvider>
  );
};

export default App;
