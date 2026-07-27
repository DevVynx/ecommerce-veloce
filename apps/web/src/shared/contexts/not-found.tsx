"use client";

import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

type NotFoundContextType = {
  isNotFound: boolean;
  setIsNotFound: (value: boolean) => void;
};

const NotFoundContext = createContext<NotFoundContextType | null>(null);

export const NotFoundProvider = ({ children }: { children: ReactNode }) => {
  const [isNotFound, setIsNotFound] = useState(false);

  const setter = useCallback((value: boolean) => setIsNotFound(value), []);

  return (
    <NotFoundContext.Provider value={{ isNotFound, setIsNotFound: setter }}>
      {children}
    </NotFoundContext.Provider>
  );
};

export const useNotFound = () => {
  const ctx = useContext(NotFoundContext);
  if (!ctx) throw new Error("useNotFound must be used within NotFoundProvider");
  return ctx;
};
