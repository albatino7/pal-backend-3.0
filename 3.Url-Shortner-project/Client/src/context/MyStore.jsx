import { useState } from "react";
import { createContext } from "react";

export const MyStore = createContext();

export const ContextProvider = ({ children }) => {
  const [allUrlData, SetAllUrlData] = useState([]);
  return (
    <MyStore.Provider value={{ allUrlData, SetAllUrlData }}>
      {" "}
      {children}
    </MyStore.Provider>
  );
};
