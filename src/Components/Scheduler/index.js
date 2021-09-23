import React, { useState, useEffect } from "react";
import "./scheduler.css";

//start train engine api
let train = function (name, predicate) {
  let checkArrivalTime = function (dateTime) {
    if (predicate(dateTime)) return true;
    return false;
  };
  return {
    checkArrivalTime,
    name,
  };
};

let trainSchedulerEngine = function (trains) {
  let trainsFunctor = [...trains];
  let registerTrains = function (trains) {
    trains.forEach((train) => {
      trainsFunctor.push(train);
    });
    return trainsFunctor;
  };
  let generateTrainSchedule = function (train, startDate, endDate) {
    // validate that date difference is maximum one day, else we should in think in different scale
    if (departerTimeDiffInDays(startDate, endDate) > 1) throw "not supported";
    let initialDate = startDate;
    let trainsSchedule = [];
    while (initialDate <= endDate) {
      if (train.checkArrivalTime(initialDate))
        trainsSchedule.push({
          train: train.name,
          expectedArrivalDate: initialDate,
          minutesToArrive: departerTimeDiffInMinutes(startDate, initialDate),
        });
      initialDate = new Date(initialDate.getTime() + 1 * (1000 * 60));
    }
    return trainsSchedule;
  };

  let getTrainScheduleBetweenDates = function (startDate, endDate) {
    return trainsFunctor.map((train) => {
      return generateTrainSchedule(train, startDate, endDate);
    });
  };
  return { registerTrains, getTrainScheduleBetweenDates };
};

const departerTimeDiffInDays = function (startDate, endDate) {
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
};

const departerTimeDiffInMinutes = function (startDate, endDate) {
  return Math.round((endDate - startDate) / (1000 * 60));
};

let trains = [
  new train("Central Station", (dateTime) => {
    // this train run every 20 minutes, no exception for certain dates
    return dateTime.getMinutes() % 20 === 0;
  }),
  new train("Circular", (dateTime) => {
    // this train run every 60 minutes, no exception for certain dates
    return dateTime.getMinutes() === 0;
  }),
  new train("North Square", (dateTime) => {
    // this train run every 12 minutes from 07:00 until 22:00, no exception for certain dates
    return (
      dateTime.getHours() >= 7 &&
      dateTime.getHours() <= 22 &&
      dateTime.getMinutes() % 12 === 0
    );
  }),
  new train("West Market", (dateTime) => {
    // this train run every 6 minutes from 05:30 until 01:30, no exception for certain dates
    return (
      dateTime.getHours() + dateTime.getMinutes() >= 35 &&
      dateTime.getHours() + dateTime.getMinutes() <= 31 &&
      dateTime.getMinutes() % 6 === 0
    );
  }),
];
const setInitialTime = (hours) => {
  let startDate = new Date().setHours(hours);
  startDate = new Date(startDate).setMinutes(0);
  return new Date(new Date(startDate).setSeconds(0));
};

const ScheduledTrainTable = (props) => {
  const constinitialSetHours = props.initialSetHours;
  const schedulerMinutes = props.schedulerMinutes;
  const pageSize = props.pageSize;

  const [data, setData] = useState([]);
  const [startSchedulerDate, setStartSchedulerDate] = useState(
    setInitialTime(props.initialSetHours)
  );

  useEffect(() => {
    schedulerTick(); //only for first time rendering.
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => schedulerTick(), 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [data]);

  const addMinutes = (dateOffset, minutes) => {
    return new Date(dateOffset.getTime() + minutes * (1000 * 60));
  };

  // update state
  const schedulerTick = () => {
    let engine = trainSchedulerEngine(trains);
    let endSchedulerDate = addMinutes(startSchedulerDate, 15);
    endSchedulerDate = new Date(endSchedulerDate).setSeconds(0);
    //transform data
    let rawData = engine.getTrainScheduleBetweenDates(
      new Date(startSchedulerDate),
      new Date(endSchedulerDate)
    );
    let flattenData = rawData.reduce((a, b) => {
      return a.concat(b);
    });
    let sortedData = flattenData.sort((a, b) => {
      return a.expectedArrivalDate - b.expectedArrivalDate;
    });
    // show pages each interval (3 seconds)
    let pagedData = sortedData.slice(0, pageSize).map((v, i) => {
      return {
        station: v.train,
        expectedArrivalDate: v.expectedArrivalDate,
        minutesToArrive: v.minutesToArrive,
      };
    });
    setData(pagedData);
    setStartSchedulerDate(addMinutes(startSchedulerDate, schedulerMinutes));
  };
  return (
    <table style={{ width: "100%" }}>
      <tr>
        <th className="tableHeaderText">S no.</th>
        <th className="tableHeaderText">Train name</th>
        <th className="tableHeaderText">Arriving in</th>
      </tr>
      {data.map((value, idx) => (
        <tr>
          <td className="trainInfoText">{idx + 1}</td>
          <td className="trainInfoText"> {value.station}</td>
          <td className="trainInfoText">{value.minutesToArrive + " min"}</td>
        </tr>
      ))}
    </table>
  );
};

export default ScheduledTrainTable;
