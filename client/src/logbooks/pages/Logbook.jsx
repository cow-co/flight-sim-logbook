import React from "react";
import Typography from "@material-ui/core/Typography";
import RadarChart from "react-svg-radar-chart";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import "react-svg-radar-chart/build/css/index.css";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isLoggedIn } from "../../common/helpers/utils";

class Logbook extends React.Component {
  constructor(props) {
    super(props);
  }

  // TODO Row with grid layout; showing the total hours and the kills for the aircraft
  // TODO Radar chart for main logbook factors
  // TODO Button to add a mission
  render() {
    let radarData = this.props.logbook;
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
            <RadarChart data={radarData} size={400} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Logbook.propTypes = {
  logbooks: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loggbook: state.logbooks.selectedLogbook,
});

export default connect(mapStateToProps, { logbooks })(Logbook);
