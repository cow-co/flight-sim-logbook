import React from "react";
import Axios from "axios";
import { axiosConfig } from "../../common/helpers/axiosConfig";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Grid from "@material-ui/core/Grid";
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
          ...this.state,
          aircraftCapabilities: response.data.aircraft,
        });
      }
    } catch (error) {
      setAlert(`${error}`, "error");
    }
  }

  // TODO Checkboxes for the practiced skills (ones not allowed via the getAircraft response will be disabled)

  handleClose() {
    this.setState({
      ...this.state,
      open: false,
    });
  }

  render() {
    const checkboxes = (
      <DialogContent>
        <FormControlLabel
          control={<Checkbox checked={this.state.imc} onChange={handleChange} name="imc" />}
          label="IMC"
        />
        <FormControlLabel
          control={<Checkbox checked={this.state.bfm} onChange={handleChange} name="bfm" />}
          label="BFM"
        />
        <FormControlLabel
          control={
            <Checkbox
              disabled={this.state.aircraftCapabilities.bvrCapable}
              checked={this.state.bvr}
              onChange={handleChange}
              name="bvr"
            />
          }
          label="BVR"
        />
        <FormControlLabel
          control={
            <Checkbox
              disabled={this.state.aircraftCapabilities.agCapable}
              checked={this.state.sead}
              onChange={handleChange}
              name="sead"
            />
          }
          label="SEAD"
        />
      </DialogContent>
    );
    return (
      <Dialog open={this.state.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a Mission</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
            label="Secondary"
          />
          {checkboxes}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddMissionModal;
