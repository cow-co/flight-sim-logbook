import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddIcon from "@material-ui/icons/Add";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { getAllAircraft } from "../../aircraft/redux/aircraft-actions";

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
    this.setState({ ...this.state, selectedAircraft: this.props.aircraft[0] });
  }

  // TODO Send off create-logbook request when plus button is clicked
  render() {
    return (
      <ListItem button>
        <Select value={this.state.selectedAircraft.name}>
          {this.props.aircraft.forEach((aircraft) => {
            return <MenuItem value={aircraft.name}>{aircraft.name}</MenuItem>;
          })}
        </Select>
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
