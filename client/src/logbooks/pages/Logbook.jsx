import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import RadarChart from "react-svg-radar-chart";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FlightIcon from "@material-ui/icons/Flight";
import AssignmentIcon from "@material-ui/icons/Assignment";
import "react-svg-radar-chart/build/css/index.css";
import "./Logbook.css";
import { Button } from "@material-ui/core";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectLogbook } from "../redux/logbook-actions";
import aircraft from "../../../../services/aircraft";

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

    this.percentageTheData = this.percentageTheData.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  async componentDidMount() {
    await this.props.selectLogbook(this.state.username, this.state.aircraft);
  }

  openModal() {
    console.log("Open Modal");
  }

  // Convert the values to percentages
  percentageTheData(data) {
    const totalSorties = data.totalSorties;

    // BVY Capable
    if (data.bvrSorties) {
      data.bvrSorties = (data.bvrSorties / totalSorties) * 100.0;
    }

    // Carrier capable
    if (data.caseISorties) {
      data.caseISorties = (data.caseISorties / totalSorties) * 100.0;
      data.caseIIISorties = (data.caseIIISorties / totalSorties) * 100.0;
    }

    // A2G capable
    if (data.seadSorties) {
      data.seadSorties = (data.seadSorties / totalSorties) * 100.0;
      data.casSorties = (data.casSorties / totalSorties) * 100.0;
      data.strikeSorties = (data.strikeSorties / totalSorties) * 100.0;
    }

    data.imcSorties = (data.imcSorties / totalSorties) * 100.0;
    data.bfmSorties = (data.bfmSorties / totalSorties) * 100.0;
    data.packageSorties = (data.packageSorties / totalSorties) * 100.0;
    data.aarSorties = (data.aarSorties / totalSorties) * 100.0;

    return data;
  }

  // TODO Button to add a mission
  render() {
    if (this.props.logbook !== null) {
      let percentageData = {
        ...this.props.logbook,
      };
      percentageData = this.percentageTheData(percentageData);
      delete percentageData.totalHours;
      delete percentageData.a2aKills;
      delete percentageData.totalSorties;

      let radarData = [
        {
          data: percentageData,
        },
      ];

      const hours = this.props.logbook.totalHours;
      const kills = this.props.logbook.a2aKills;

      const captions = {
        imcSorties: "IMC",
        bfmSorties: "BFM",
        bvrSorties: "BVR",
        seadSorties: "SEAD",
        casSorties: "CAS",
        strikeSorties: "Strike",
        packageSorties: "Coordinated Package",
        caseISorties: "Case I",
        caseIIISorties: "Case III",
        aarSorties: "AAR",
      };

      console.log(captions);

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
          <RadarChart className="radar" data={radarData} captions={captions} size={400} />

          <Button
            color="primary"
            className="add-mission"
            startIcon={<AssignmentIcon />}
            variant="contained"
            onClick={this.openModal}
          >
            Add Mission
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Typography variant="h4" className="title">
            {this.state.aircraft}
          </Typography>
        </div>
      );
    }
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
