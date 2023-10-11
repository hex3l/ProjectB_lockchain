import { Container, CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import { getVersionInfo } from 'utils-version';

import 'common/styles/global.css';
import { BottomBar } from 'modules/BottomBar';
import { TopBar } from 'modules/TopBar';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Monorepo Boilerplate - App (Tailwind)</title>
        <meta name="description" content="Monorepo Boilerplate - App (Tailwind)." />
        <meta name="version" content={getVersionInfo()} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      <TopBar />
      <Container maxWidth="xl" className="pb-11">
        <Component {...pageProps} />
      </Container>
      <BottomBar />
    </>
  );
};

export default App;
