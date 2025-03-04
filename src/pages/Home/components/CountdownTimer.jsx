import { useState, useEffect } from "react";

const CountdownTimer = () => {
  // Thời gian đích: 7:00 ngày 01/03/2025
  const targetDate = new Date("2025-04-01T07:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center ">
      {/* Countdown */}
      <div className="flex space-x-4 text-center">
        {Object.entries(timeLeft).map(([label, value], index) => (
          <div key={label} className="flex items-center">
            {index > 0 && (
              <span className="text-3xl font-semibold text-red-300">:</span>
            )}
            <div>
              <div className="text-sm font-medium text-gray-700 capitalize">
                {label}
              </div>
              <div className="text-3xl font-semibold text-black">
                {value.toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
