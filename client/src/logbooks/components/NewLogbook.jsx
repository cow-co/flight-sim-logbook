import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddIcon from "@material-ui/icons/Add";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { getAllAircraft } from "../../aircraft/redux/aircraft-actions";
import { isEmpty } from "../../common/helpers/utils";

import { connect } from "react-redux";
import PropTypes from "prop-types";

class NewLogbook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAircraft: {
        name: "",
      },
    };
  }

  async componentDidMount() {
    await this.props.getAllAircraft();
    this.setState({ ...this.state, selectedAircraft: this.props.aircraft.aircraftList[0] });
  }

  // TODO Send off create-logbook request when plus button is clicked
  render() {
    var dropdown;

    if (!isEmpty(this.props.aircraft.aircraftList) && this.props.aircraft.aircraftList.length > 0) {
      dropdown = (
        <Select value={this.state.selectedAircraft.name}>
          {this.props.aircraft.aircraftList.forEach((aircraft) => {
            return <MenuItem value={aircraft.name}>{aircraft.name}</MenuItem>;
          })}
        </Select>
      );
    } else {
      dropdown = <Select value=""></Select>;
    }
    console.log(`dropdown: ${dropdown}`);
    return (
      <ListItem button>
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
