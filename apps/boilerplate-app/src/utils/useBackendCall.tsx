/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useSnackbar } from 'notistack';
import { useCallback, useContext } from 'react';
import { useDisconnect } from 'wagmi';

import { clone } from 'utils';

import { GlobalStateContext } from './GlobalState';

/**
 * Injects Authorization header in fetch calls
 * @param relpath backend realtive path
 * @param params RequestInit object
 * @returns fetch result
 */
export const useBackendCall = () => {
  const { state, setState } = useContext(GlobalStateContext);

  const { disconnect } = useDisconnect();
  const { enqueueSnackbar } = useSnackbar();

  const backendCall = useCallback(
    async (relpath: string, params: RequestInit = {}) => {
      const { headers } = params;
      let reqHeaders = {};
      if (headers) reqHeaders = clone(headers);
      delete params.headers;

      const res = await fetch(`${process.env.BACKEND}/${relpath}`, {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
          'Content-Type': 'application/json',
          ...reqHeaders,
        },
        ...params,
      });

      if (!res.ok) {
        switch (res.status) {
          case 401:
            console.log('User is not logged into backend');
            // We need to log the user in again, how
            if (setState) setState({ ...state, auth: { jwt: null } });
            disconnect();
            enqueueSnackbar('You have been disconnected! Please log in again.', { variant: 'error' });
            setTimeout(() => {
              const loginBtn = document.getElementById('loginButton');
              console.log('loginBtn', loginBtn);
              loginBtn?.click();
            }, 1000);
            return undefined;
        }
        // This will activate the closest `error.js` Error Boundary
        let response;
        try {
          response = await res.json();
        } catch {
          enqueueSnackbar(`Failed to fetch data`, { variant: 'error' });
        }
        enqueueSnackbar(`${response.error}`, { variant: 'error' });
        throw new Error(`Fetch ${response?.error ?? 'error'}`);
      }
      try {
        const result = await res.text();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        if (result.length > 2) return JSON.parse(result);
      } catch {}
      return undefined;
    },
    [disconnect, enqueueSnackbar, setState, state],
  );

  return backendCall;
};
