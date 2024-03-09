/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextRouter } from 'next/router';

export const addQueryParams = async (router: NextRouter, name: string, value: string) => {
  await router.push({
    ...router,
    query: {
      ...router.query,
      [name]: value,
    },
  });
};
