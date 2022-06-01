import React, { useEffect, useState } from 'react';

const Randomizer: React.FC = () => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const randomize = async () => {
      setNumber(Math.floor(Math.random() * 1000));
    };
    randomize();
    const interval = setInterval(randomize, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>{number}</div>;
};

export default Randomizer;
