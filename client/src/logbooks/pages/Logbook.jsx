import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import RadarChart from "react-svg-radar-chart";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FlightIcon from "@material-ui/icons/Flight";
import AssignmentIcon from "@material-ui/icons/Assignment";
import "./Logbook.css";
import { Button } from "@material-ui/core";
import Radar from "react-d3-radar";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { selectLogbook } from "../redux/logbook-actions";
import AddMissionModal from "../components/AddMissionModal";

class Logbook extends React.Component {
  constructor(props) {
    super(props);
    const tokenisedPath = this.props.location.pathname.split("/");
    const aircraft = decodeURIComponent(tokenisedPath[tokenisedPath.length - 1]);
    const username = decodeURIComponent(tokenisedPath[tokenisedPath.length - 2]);

    this.state = {
      username,
      aircraft,
      logbook: this.props.logbook,
      modalOpen: false,
    };

    this.fractionTheData = this.fractionTheData.bind(this);
    this.handleFormClose = this.handleFormClose.bind(this);
    this.handleFormOpen = this.handleFormOpen.bind(this);
    this.createCaptions = this.createCaptions.bind(this);
  }

  async componentDidMount() {
    await this.props.selectLogbook(this.state.username, this.state.aircraft);
  }

  handleFormOpen() {
    this.setState({
      modalOpen: true,
    });
  }

  handleFormClose() {
    this.setState({
      modalOpen: false,
    });
  }

  // Convert the values to fractions
  fractionTheData(data) {
    const totalSorties = data.totalSorties;

    // BVR Capable
    if (data.bvrSorties) {
      data.bvrSorties = data.bvrSorties / totalSorties;
    }

    // Carrier capable
    if (data.caseISorties) {
      data.caseISorties = data.caseISorties / totalSorties;
      data.caseIIISorties = data.caseIIISorties / totalSorties;
    }

    // A2G capable
    if (data.seadSorties) {
      data.seadSorties = data.seadSorties / totalSorties;
      data.casSorties = data.casSorties / totalSorties;
      data.strikeSorties = data.strikeSorties / totalSorties;
    }

    data.imcSorties = data.imcSorties / totalSorties;
    data.bfmSorties = data.bfmSorties / totalSorties;
    data.packageSorties = data.packageSorties / totalSorties;
    data.aarSorties = data.aarSorties / totalSorties;

    return data;
  }

  createCaptions(data) {
    let captions = [
      { key: "imcSorties", label: "IMC" },
      { key: "bfmSorties", label: "BFM" },
      { key: "packageSorties", label: "Multiplayer" },
      { key: "aarSorties", label: "AAR" },
    ];

    // BVR Capable
    if (data.bvrSorties) {
      captions.push({ key: "bvrSorties", label: "BVR" });
    }

    // Carrier capable
    if (data.caseISorties) {
      captions.push({ key: "caseISorties", label: "Case I" });
      captions.push({ key: "caseIIISorties", label: "Case III" });
    }

    // A2G capable
    if (data.seadSorties) {
      captions.push({ key: "seadSorties", label: "SEAD" });
      captions.push({ key: "casSorties", label: "CAS" });
      captions.push({ key: "strikeSorties", label: "Strike" });
    }

    return captions;
  }

  render() {
    if (this.props.logbook !== null) {
      let data = {
        ...this.props.logbook,
      };
      delete data.totalHours;
      delete data.a2aKills;
      delete data.totalSorties;

      const captions = this.createCaptions(data);
      console.log(captions);
      console.log(data);

      const hours = this.props.logbook.totalHours;
      const kills = this.props.logbook.a2aKills;
      const sorties = this.props.logbook.totalSorties;

      return (
        <div>
          <Typography variant="h4" className="title">
            {this.state.aircraft}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <AccessTimeIcon />
              <Typography variant="h6">{hours} Hours</Typography>
            </Grid>
            <Grid item xs={4}>
              <FlightIcon />
              <Typography variant="h6">{sorties} Sorties</Typography>
            </Grid>
            <Grid item xs={4}>
              <FlightIcon />
              <Typography variant="h6">{kills} Kills</Typography>
            </Grid>
          </Grid>
          <Radar
            width={300}
            height={300}
            padding={70}
            domainMax={1}
            highlighted={null}
            data={{
              variables: captions,
              sets: [
                {
                  values: data,
                },
              ],
            }}
          />
          <AddMissionModal
            open={this.state.modalOpen}
            handleClose={this.handleFormClose}
            aircraft={this.state.aircraft}
          />

          <Button
            color="primary"
            className="add-mission"
            startIcon={<AssignmentIcon />}
            variant="contained"
            onClick={this.handleFormOpen}
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
