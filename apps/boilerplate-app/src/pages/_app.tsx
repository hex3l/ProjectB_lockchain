/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container, CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import { localhost } from 'viem/chains';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { BottomBar } from 'modules/BottomBar';
import { TopBar } from 'modules/TopBar';

import 'common/styles/global.css';

const App = ({ Component, pageProps }: AppProps) => {
  const { chains, publicClient, webSocketPublicClient } = configureChains([localhost], [publicProvider()]);

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={config}>
      <Head>
        <title>Monorepo Boilerplate - App (Tailwind)</title>
        <meta name="description" content="Monorepo Boilerplate - App (Tailwind)." />
        <meta name="version" content="1.0.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      <TopBar />
      <Container maxWidth="xl" className="pb-11">
        <Component {...pageProps} />
      </Container>
      <BottomBar />
    </WagmiConfig>
  );
};

export default App;
