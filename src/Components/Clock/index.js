import React, { useState, useEffect } from "react";
import "./clock.css";

const Clock = ({ initialSetTime }) => {
  // initiate state, and any default values.
  let startDate = new Date().setHours(initialSetTime);
  startDate = new Date(startDate).setMinutes(0);
  startDate = new Date(startDate).setSeconds(0);

  const [localTime, setLocalTime] = useState(new Date(startDate));

  // render event, bind clock to each second timer

  const tick = () => {
    setLocalTime(new Date(new Date(localTime).getTime() + 1000 * 60));
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [localTime]);

  return <h5 className="clockText"> {localTime.toLocaleTimeString()} </h5>;
};
export default Clock;
