/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState } from 'react';

export const emptyGlobalState: GlobalStateData = {
  auth: {
    jwt: null,
  },
};

const GlobalStateProvider = ({ children }: GlobalStateProviderProps) => {
  const [state, setState] = useState<GlobalStateData>(emptyGlobalState);

  return <GlobalStateContext.Provider value={{ state, setState }}>{children}</GlobalStateContext.Provider>;
};

const GlobalStateContext = createContext<GlobalStateContextType>({ state: emptyGlobalState, setState: undefined });

type GlobalStateContextType = {
  state: GlobalStateData;
  setState: React.Dispatch<React.SetStateAction<GlobalStateData>> | undefined;
};

type GlobalStateProviderProps = {
  children: React.ReactNode;
};

export type GlobalStateData = {
  auth: {
    jwt: string | null;
  };
};

export { GlobalStateProvider, GlobalStateContext };
