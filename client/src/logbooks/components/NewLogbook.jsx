import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddIcon from "@material-ui/icons/Add";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { getAllAircraft } from "../../aircraft/redux/aircraft-actions";
import { isEmpty } from "../../common/helpers/utils";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./NewLogbook.css";

class NewLogbook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAircraft: {
        name: "Aircraft",
      },
    };
  }

  async componentDidMount() {
    await this.props.getAllAircraft();
  }

  // TODO Send off create-logbook request when plus button is clicked
  render() {
    let dropdown;

    if (!isEmpty(this.props.aircraft.aircraftList) && this.props.aircraft.aircraftList.length > 0) {
      dropdown = (
        <Select value={this.state.selectedAircraft.name}>
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
      dropdown = <Select value=""></Select>;
    }

    return (
      <ListItem button>
        <InputLabel>Aircraft</InputLabel>
        {dropdown}
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
      </ListItem>
    );
  }
}

NewLogbook.propTypes = {
  getAllAircraft: PropTypes.func.isRequired,
  aircraft: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  aircraft: state.aircraft,
});

export default connect(mapStateToProps, { getAllAircraft })(NewLogbook);
