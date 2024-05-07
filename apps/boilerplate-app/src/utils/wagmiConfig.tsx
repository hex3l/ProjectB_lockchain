/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { localhost } from 'viem/chains';
import { createConfig, http, cookieStorage, createStorage } from 'wagmi';

export const wagmiConfig = createConfig({
  chains: [localhost],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [localhost.id]: http('http://localhost:7545'),
  },
});
