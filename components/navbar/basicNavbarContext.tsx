"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NavbarContextType = {
  height: number;
  setHeight: (height: number) => void;
};

const NavbarContext = createContext<NavbarContextType>({
  height: 0,
  setHeight: () => {},
});

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [height, setHeight] = useState(0);

  return (
    <NavbarContext.Provider value={{ height, setHeight }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => useContext(NavbarContext);
