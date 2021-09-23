import React from "react";
import Header from "../Components/Header";
import Clock from "../Components/Clock";
import Schedular from "../Components/Scheduler";
import "./home.css";

const NTIComponent = () => {
  return (
    <div>
      <div className="header">
        <header>
          <Header title={"Next Train Indicator"} />
        </header>
        <section>
          <div className="schedularWrap">
            <Schedular initialSetHours={5} schedulerMinutes={15} pageSize={2} />
          </div>
        </section>
        <footer>
          <Clock initialSetTime={5} />
        </footer>
      </div>
    </div>
  );
};

export default NTIComponent;
