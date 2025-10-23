// import React, { useState, useEffect } from "react";

// interface CountdownTimerProps {
//   minutes: number;
// }

// const CountdownTimer: React.FC<CountdownTimerProps> = ({ minutes }) => {
//   const [timeLeft, setTimeLeft] = useState(minutes * 60);
//   useEffect(() => {
//     if (timeLeft <= 0) return;

//     const timerId = setInterval(() => {
//       setTimeLeft((prevTime) => prevTime - 1);
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   return (
//     <div>
//       <p className="text-base text-md">{formatTime(timeLeft)} minutes</p>
//     </div>
//   );
// };

// export default CountdownTimer;

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  minutes: number;
  onExpire: () => void; // Callback function to notify parent on expiry
  key?: any;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  minutes,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire(); // Notify parent that timer expired
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div>
      <p className="text-base text-md">{formatTime(timeLeft)} miutes</p>
    </div>
  );
};

export default CountdownTimer;
