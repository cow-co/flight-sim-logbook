import React from "react";
import Typography from "@material-ui/core/Typography";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";

class Logbook extends React.Component {
  constructor(props) {
    super(props);
  }

  // TODO Row with grid layout; showing the total hours and the kills for the aircraft
  // TODO Radar chart for main logbook factors
  // TODO Button to add a mission
  render() {
    return (
      <div>
        <Typography variant="h4" className="title">
          {this.props.logbook.aircraft}
        </Typography>
      </div>
    );
  }
}

export default Logbook;
