import React, { createContext, ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}
export interface UserContextType {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext({} as UserContextType);

export const UserProvider = (props: Props) => {
  const { children } = props;
  const [token, setToken] = useState("");

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
