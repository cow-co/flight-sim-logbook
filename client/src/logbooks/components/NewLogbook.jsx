import React from "react";
import ListItem from "@material-ui/core/ListItem";
import AddIcon from "@material-ui/icons/Add";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { getAllAircraft } from "../../aircraft/redux/aircraft-actions";
import { createLogbook } from "../redux/logbook-actions";
import { isEmpty } from "../../common/helpers/utils";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./NewLogbook.css";
import { Button } from "@material-ui/core";

class NewLogbook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAircraft: {
        name: "Aircraft",
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendCreateRequest = this.sendCreateRequest.bind(this);
  }

  async componentDidMount() {
    await this.props.getAllAircraft();
    this.setState({ selectedAircraft: this.props.aircraft.aircraftList[0].name });
  }

  handleChange(event) {
    this.setState({ selectedAircraft: event.target.value });
  }

  sendCreateRequest = async (event) => {
    event.preventDefault();
    console.log(`Sending create request for ${aircraftName}`);
    await this.props.createLogbook({ aircraftName: this.state.selectedAircraft });
  };

  // TODO Send off create-logbook request when plus button is clicked
  render() {
    let dropdown;

    if (!isEmpty(this.props.aircraft.aircraftList) && this.props.aircraft.aircraftList.length > 0) {
      dropdown = (
        <Select value={this.state.selectedAircraft} onChange={this.handleChange} labelId="aircraft-label">
          {this.props.aircraft.aircraftList.map((aircraft, index) => {
            return (
              <MenuItem key={index} value={aircraft.name}>
                {aircraft.name}
              </MenuItem>
            );
          })}
        </Select>
      );
    } else {
      dropdown = (
        <Select value={this.state.selectedAircraft} onChange={this.handleChange} labelId="aircraft-label"></Select>
      );
    }

    return (
      <ListItem>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl>
              <InputLabel id="aircraft-label">Aircraft</InputLabel>
              {dropdown}
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={this.sendCreateRequest}>
              Create
            </Button>
          </Grid>
        </Grid>
      </ListItem>
    );
  }
}

NewLogbook.propTypes = {
  getAllAircraft: PropTypes.func.isRequired,
  createLogbook: PropTypes.func.isRequired,
  aircraft: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  aircraft: state.aircraft,
});

export default connect(mapStateToProps, { getAllAircraft, createLogbook })(NewLogbook);
