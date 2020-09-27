import React from "react";
import Axios from "axios";
import { axiosConfig } from "../../common/helpers/axiosConfig";
import { setAlert } from "../../common/redux/common-actions";
import { logMission } from "../redux/logbook-actions";
import { isEmpty } from "../../common/helpers/utils";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Button } from "@material-ui/core";

class AddMissionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open,
      aircraftCapabilities: null,
      mission: {
        aircraft: this.props.aircraft,
        duration: 0,
        a2aKills: 0,
        imc: false,
        bfm: false,
        bvr: false,
        sead: false,
        cas: false,
        strike: false,
        package: false,
        caseI: false,
        caseIII: false,
        aar: false,
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStringChanged = this.handleStringChanged.bind(this);
    this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
  }

  async componentDidMount() {
    // Get the aircraft capabilities
    const config = {
      ...axiosConfig(),
    };

    try {
      const response = await Axios.get(`/api/aircraft/${encodeURIComponent(this.props.aircraft)}`, config);
      const errors = response.data.errors;

      if (!isEmpty(errors)) {
        errors.forEach((error) => setAlert(`${error}`, "error"));
      } else {
        this.setState({
          aircraftCapabilities: response.data.aircraft,
        });
      }
    } catch (error) {
      setAlert(`${error}`, "error");
    }
  }

  // TODO Checkboxes for the practiced skills (ones not allowed via the getAircraft response will be disabled)

  async handleSubmit() {
    await logMission(this.state.mission);
    this.props.onClose();
  }

  handleStringChanged = (name) => (event) => {
    this.setState({ ...this.state, aircraft: { [name]: event.target.value } });
  };

  handleCheckboxChanged = (name) => (event) => {
    this.setState({ ...this.state, aircraft: { [name]: event.target.checked } });
  };

  render() {
    let checkboxes = null;

    if (this.state.aircraftCapabilities !== null) {
      checkboxes = (
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox checked={this.state.mission.imc} onChange={this.handleCheckboxChanged("imc")} value="imc" />
            }
            label="IMC"
          />
          <FormControlLabel
            control={
              <Checkbox checked={this.state.mission.bfm} onChange={this.handleCheckboxChanged("bfm")} name="bfm" />
            }
            label="BFM"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={this.state.aircraftCapabilities.bvrCapable}
                checked={this.state.mission.bvr}
                onChange={this.handleCheckboxChanged("bvr")}
                name="bvr"
              />
            }
            label="BVR"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={this.state.aircraftCapabilities.agCapable}
                checked={this.state.mission.sead}
                onChange={this.handleCheckboxChanged("sead")}
                name="sead"
              />
            }
            label="SEAD"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={this.state.aircraftCapabilities.agCapable}
                checked={this.state.mission.cas}
                onChange={this.handleCheckboxChanged("cas")}
                name="cas"
              />
            }
            label="CAS"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={this.state.aircraftCapabilities.agCapable}
                checked={this.state.mission.strike}
                onChange={this.handleCheckboxChanged("strike")}
                name="strike"
              />
            }
            label="Strike"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.mission.package}
                onChange={this.handleCheckboxChanged("package")}
                name="package"
              />
            }
            label="Coordinated Package"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={this.state.aircraftCapabilities.carrierOpsCapable}
                checked={this.state.mission.caseI}
                onChange={this.handleCheckboxChanged("caseI")}
                name="caseI"
              />
            }
            label="Case I"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={this.state.aircraftCapabilities.carrierOpsCapable}
                checked={this.state.mission.caseIII}
                onChange={this.handleCheckboxChanged("caseIII")}
                name="caseIII"
              />
            }
            label="Case III"
          />
          <FormControlLabel
            control={
              <Checkbox checked={this.state.mission.aar} onChange={this.handleCheckboxChanged("aar")} name="aar" />
            }
            label="AAR"
          />
        </DialogContent>
      );
    }

    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a Mission</DialogTitle>
        {checkboxes}
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddMissionModal;
