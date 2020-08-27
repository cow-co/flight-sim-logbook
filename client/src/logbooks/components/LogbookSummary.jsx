import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PageviewIcon from "@material-ui/icons/Pageview";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import "./LogbookSummary.css";
import { deleteLogbook, selectLogbook } from "../redux/logbook-actions";

import { connect } from "react-redux";
import PropTypes from "prop-types";

class LogbookSummary extends React.Component {
  constructor(props) {
    super(props);
    console.debug(props);
    this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
    this.viewLogbook = this.viewLogbook.bind(this);
  }

  async sendDeleteRequest() {
    await this.props.deleteLogbook(this.props.logbook.aircraft);
  }

  async viewLogbook() {
    await this.props.selectLogbook(this.props.logbook);
    this.props.history.push("/logbooks/view");
  }

  render() {
    return (
      <ListItem>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <ListItemText
              primary={`${this.props.logbook.aircraft}`}
              secondary={`Hours: ${this.props.logbook.totalHours}; Kills: ${this.props.logbook.a2aKills}`}
            />
          </Grid>
          <Grid item xs={4}>
            <Button color="primary" variant="contained" startIcon={<PageviewIcon />} onClick={this.viewLogbook}>
              View
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              color="secondary"
              variant="contained"
              startIcon={<DeleteForeverIcon />}
              onClick={this.sendDeleteRequest}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </ListItem>
    );
  }
}

LogbookSummary.propTypes = {
  deleteLogbook: PropTypes.func.isRequired,
  selectLogbook: PropTypes.func.isRequired,
};

export default connect(null, { deleteLogbook, selectLogbook })(LogbookSummary);
