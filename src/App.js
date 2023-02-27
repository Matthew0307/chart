import React, { useEffect, useState } from "react";
import "./App.css";
import chartData from "../src/data.json";
import { LineChart } from "../src/components/LineChart";

function App() {
  const [data, setData] = useState([]);
  const [isReady,setIsReady] = useState(false);
  useEffect(() => {
    if(!isReady){
      setIsReady(true);
      return;
    }
    if (chartData) {
      setData(chartData);
    }
  }, [isReady]);

  if (!data || !isReady) {
    return <a>Loading</a>
  }

  return (
    <div className="App">
      <LineChart data={data} />
    </div>
  );
}

export default App;
