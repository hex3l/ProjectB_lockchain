/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const addQueryParams = (router: AppRouterInstance, name: string, value: string) => {
  // @ts-expect-error: Property 'query' does not exist on type 'Router'.
  router.replace({
    query: { [name]: value },
  });
};
