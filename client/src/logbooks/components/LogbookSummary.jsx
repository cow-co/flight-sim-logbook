import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FlightIcon from "@material-ui/icons/Flight";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

class LogbookSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListItem button>
        <Link to={`/logbooks/${this.props.username}/${this.props.logbook.aircraftName}`}>
          <ListItemIcon>
            <FlightIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${this.props.logbook.aircraftName}`}
            secondary={`Hours: ${this.props.logbook.totalHours}; Kills: ${this.props.logbook.a2aKills}`}
          />
        </Link>
      </ListItem>
    );
  }
}

export default LogbookSummary;
