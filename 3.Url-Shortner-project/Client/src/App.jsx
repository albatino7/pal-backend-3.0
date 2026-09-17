import React from "react";
import { useContext } from "react";
import { MyStore } from "./context/MyStore";
import axios from "axios";
import { useEffect } from "react";
import Urlcard from "./components/Urlcard";

const App = () => {
  const { allUrlData, SetAllUrlData } = useContext(MyStore);
  console.log(allUrlData);

  const gettAllUrl = async () => {
    const response = await axios.get("http://localhost:5173/api/url/get-url");
    // console.log(response.data.allUrl);
    SetAllUrlData(response.data.allUrl);
  };

  useEffect(() => {
    gettAllUrl();
  }, []);

  return (
    <>
      <Urlcard gettAllUrl={gettAllUrl} />
    </>
  );
};

export default App;
