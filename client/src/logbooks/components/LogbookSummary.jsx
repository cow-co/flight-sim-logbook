import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";

class LogbookSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListItem button>
        <Link to={`/logbooks/${this.props.username}/${this.props.logbook.aircraftName}`}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <ListItemText
                primary={`${this.props.logbook.aircraft}`}
                secondary={`Hours: ${this.props.logbook.totalHours}; Kills: ${this.props.logbook.a2aKills}`}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                color="primary"
                variant="contained"
                startIcon={<DeleteForeverIcon />}
                onClick={this.sendDeleteRequest}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Link>
      </ListItem>
    );
  }
}

export default LogbookSummary;
