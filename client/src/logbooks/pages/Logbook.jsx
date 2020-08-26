import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import RadarChart from "react-svg-radar-chart";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FlightIcon from "@material-ui/icons/Flight";
import "react-svg-radar-chart/build/css/index.css";

import { connect } from "react-redux";
import PropTypes from "prop-types";

class Logbook extends React.Component {
  constructor(props) {
    super(props);
  }

  // TODO Row with grid layout; showing the total hours and the kills for the aircraft
  // TODO Radar chart for main logbook factors
  // TODO Button to add a mission
  render() {
    let radarData = {
      ...this.props.logbook,
    };
    delete radarData.totalHours;
    delete radarData.a2aKills;

    return (
      <div>
        <Typography variant="h4" className="title">
          {this.props.logbook.aircraft}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <AccessTimeIcon />
            <Typography variant="h6">{this.props.logbook.totalHours} Hours</Typography>
          </Grid>
          <Grid item xs={6}>
            <FlightIcon />
            <Typography variant="h6">{this.props.logbook.a2aKills} Kills</Typography>
          </Grid>
        </Grid>
        <RadarChart data={radarData} size={400} />
      </div>
    );
  }
}

Logbook.propTypes = {
  logbook: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  logbook: state.logbooks.selectedLogbook,
});

export default connect(mapStateToProps, null)(Logbook);
