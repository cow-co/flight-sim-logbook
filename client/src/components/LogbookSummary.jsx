const { Component } = require("react");
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FlightIcon from "@material-ui/icons/Flight";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

class LogbookSummary extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListItem button>
        <Link to={`/logbooks/${this.props.username}/${this.props.aircraftName}`}>
          <ListItemIcon>
            <FlightIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${this.props.aircraftName}`}
            secondary={`Hours: ${this.props.totalHours}; Kills: ${this.props.kills}`}
          />
        </Link>
      </ListItem>
    );
  }
}

export default LogbookSummary;
