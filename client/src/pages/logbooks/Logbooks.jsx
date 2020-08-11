import React from "react";
import List from "@material-ui/core/List";
import LogbookSummary from "../../components/LogbookSummary";
import { getAllLogbooks } from "../../redux/actions/logbook-actions";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ListItem } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";

class Logbooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.props.getAllLogbooks();
    this.onAddClick = this.onAddClick.bind(this);
    this.modalClose = this.modalClose.bind(this);
  }

  // TODO Open the modal in here
  onAddClick() {
    this.setState({
      modalOpen: true,
    });
  }

  modalClose() {
    this.setState({
      modalOpen: false,
    });
  }

  // TODO Method for sending off the Redux request to create a logbook

  render() {
    // TODO Fill out modal panel for creating a logbook
    let logbookList;

    if (this.props.logbooks.length > 0) {
      logbookList = this.props.logbooks.forEach((logbook) => {
        return <LogbookSummary username={this.props.users.username} logbook={logbook} />;
      });
    }

    return (
      <div>
        <List>
          {logbookList}
          <ListItem button onClick={this.onAddClick}>
            Create a Logbook
          </ListItem>
        </List>
      </div>
    );
  }
}

Logbooks.propTypes = {
  getAllLogbooks: PropTypes.func.isRequired,
  logbooks: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  logbooks: state.logbooks,
  users: state.users,
});

export default connect(mapStateToProps, { getAllLogbooks })(Logbooks);
