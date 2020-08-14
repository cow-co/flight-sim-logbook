import React from "react";
import List from "@material-ui/core/List";
import LogbookSummary from "../components/LogbookSummary";
import NewLogbook from "../components/NewLogbook";
import { getAllLogbooks } from "../redux/logbook-actions";

import { connect } from "react-redux";
import PropTypes from "prop-types";

class Logbooks extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.props.getAllLogbooks();
  }

  render() {
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
          <NewLogbook />
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
