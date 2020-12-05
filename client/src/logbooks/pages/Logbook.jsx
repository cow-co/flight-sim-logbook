import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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
    if (data.bvrSorties !== undefined) {
      captions.push({ key: "bvrSorties", label: "BVR" });
    }

    // Carrier capable
    if (data.caseISorties !== undefined) {
      captions.push({ key: "caseISorties", label: "Case I" });
      captions.push({ key: "caseIIISorties", label: "Case III" });
    }

    // A2G capable
    if (data.seadSorties !== undefined) {
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

      const hours = this.props.logbook.totalHours;
      const kills = this.props.logbook.a2aKills;
      const sorties = this.props.logbook.totalSorties;

      return (
        <div>
          <Typography variant="h4" className="title">
            {this.state.aircraft}
          </Typography>
          <Grid container>
            <Grid className="cell" item xs={3}>
              <Typography className="cell" variant="h6">
                {hours} Hours
              </Typography>
            </Grid>
            <Grid className="cell" item xs={3}>
              <Typography className="cell" variant="h6">
                {sorties} Sorties
              </Typography>
            </Grid>
            <Grid className="cell" item xs={3}>
              <Typography className="cell" variant="h6">
                {kills} Kills
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button color="primary" className="add-mission" variant="contained" onClick={this.handleFormOpen}>
                Add Mission
              </Button>
            </Grid>
          </Grid>
          <Radar
            width={500}
            height={500}
            padding={70}
            domainMax={sorties}
            highlighted={null}
            className="radar"
            data={{
              variables: captions,
              sets: [
                {
                  key: "data",
                  label: this.state.aircraft,
                  values: data,
                },
              ],
            }}
            colors={{ data: "#d32f2f" }}
          />
          <AddMissionModal
            open={this.state.modalOpen}
            handleClose={this.handleFormClose}
            aircraft={this.state.aircraft}
          />
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
