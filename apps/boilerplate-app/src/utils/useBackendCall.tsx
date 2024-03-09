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

  const backendCall = useCallback(
    async (relpath: string, params: RequestInit = {}) => {
      const { headers } = params;
      console.log('backendCall');
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
            // We need to log the user in again, how
            if (setState) setState({ ...state, auth: { jwt: null } });
            disconnect();
        }
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
      }

      return res.json();
    },
    [disconnect, setState, state],
  );

  return backendCall;
};
