import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import RadarChart from "react-svg-radar-chart";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FlightIcon from "@material-ui/icons/Flight";
import "react-svg-radar-chart/build/css/index.css";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectLogbook } from "../redux/logbook-actions";

class Logbook extends React.Component {
  constructor(props) {
    console.debug(props);
    super(props);
    const tokenisedPath = this.props.location.pathname.split("/");
    const aircraft = decodeURIComponent(tokenisedPath[tokenisedPath.length - 1]);
    const username = decodeURIComponent(tokenisedPath[tokenisedPath.length - 2]);

    this.state = {
      username,
      aircraft,
    };
  }

  async componentDidMount() {
    await this.props.selectLogbook(this.state.username, this.state.aircraft);
  }

  // TODO Button to add a mission
  render() {
    let radarData = {
      ...this.props.logbook,
    };

    if (this.props.logbook !== null) {
      delete radarData.totalHours;
      delete radarData.a2aKills;
    }

    const hours = this.props.logbook !== null ? this.props.logbook.totalHours : 0;
    const kills = this.props.logbook !== null ? this.props.logbook.a2aKills : 0;

    return (
      <div>
        <Typography variant="h4" className="title">
          {this.state.aircraft}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <AccessTimeIcon />
            <Typography variant="h6">{hours} Hours</Typography>
          </Grid>
          <Grid item xs={6}>
            <FlightIcon />
            <Typography variant="h6">{kills} Kills</Typography>
          </Grid>
        </Grid>
        <RadarChart data={radarData} size={400} />
      </div>
    );
  }
}

Logbook.propTypes = {
  logbook: PropTypes.object.isRequired,
  selectLogbook: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  logbook: state.logbooks.selectedLogbook,
});

export default connect(mapStateToProps, { selectLogbook })(Logbook);
