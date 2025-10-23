import React, { useState, useEffect } from "react";

interface CounterProps {
  end: number;
  duration: number;
  className?: string;
}

const AnimateNumber: React.FC<CounterProps> = ({
  end,
  duration,
  className,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endValue = end;
    const incrementTime = Math.floor(duration / endValue);

    const counter = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === endValue) {
        clearInterval(counter);
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [end, duration]);

  return (
    <div className={`text-title-xl2 font-bold ${className}`}>{count} +</div>
  );
};

export default AnimateNumber;
