import React from "react";
import Header from "../Components/header";
import Clock from "../Components/clock";
import Schedular from "../Components/scheduler";

import "./home.css";

class NTIComponent extends React.Component {
  render() {
    return (
      <div>
        <div className="header">
          <header>
            <Header title={"Next Train Indicator"} />
          </header>
          <section>
            <div className="schedularWrap">
              <Schedular
                initialSetHours={5}
                schedulerMinutes={15}
                pageSize={3}
              />
            </div>
          </section>
          <footer>
            <Clock initialSetTime={5} />
          </footer>
        </div>
      </div>
    );
  }
}

export default NTIComponent;
