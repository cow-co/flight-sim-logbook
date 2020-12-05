import React from "react";
import Typography from "@material-ui/core/Typography";
import "./Frontpage.css";

class Frontpage extends React.Component {
  render() {
    return (
      <div className="frontpage">
        <Typography variant="h4" className="title">
          Flight Sim Logbook: An Easy-to-Use, Persistent Logbook for Combat Flight Sims
        </Typography>
        <br />
        <p>
          This app allows you to have a unified way to track your flight hours in various flight simulation games. This
          means you can, for example, track your Falcon BMS hours and experience right alongside your DCS experience.
          The app will also provide advice for what areas you may want to focus on (i.e. knowledge gaps)
        </p>
      </div>
    );
  }
}

export default Frontpage;
