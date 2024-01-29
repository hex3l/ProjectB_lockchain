import { NextRouter } from 'next/router';

export const addQueryParams = (router: NextRouter, name: string, value: string) => {
  router.replace({
    query: { ...router.query, [name]: value },
  });
};
