import React, { useEffect, useState } from 'react';

const DatePoller: React.FC = () => {
  const [data, setData] = useState(0);

  useEffect(() => {
    // This is going to spam the network with X amount of requests though :P
    const doFetch = async () => {
      const response = await fetch('http://worldtimeapi.org/api/ip');
      const { unixtime } = await response.json();
      setData(unixtime);
    };
    doFetch();
    const interval = setInterval(doFetch, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>{data}</div>;
};

export default DatePoller;
