import React from "react";
import List from "@material-ui/core/List";
import LogbookSummary from "../components/LogbookSummary";
import NewLogbook from "../components/NewLogbook";
import { getAllLogbooks } from "../redux/logbook-actions";
import Typography from "@material-ui/core/Typography";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Logbooks.css";

class Logbooks extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.props.getAllLogbooks();
  }

  render() {
    let logbookList;
    console.debug(this.props.logbooks);

    if (this.props.logbooks.length > 0) {
      logbookList = this.props.logbooks.map((logbook) => {
        return <LogbookSummary username={this.props.users.username} logbook={logbook} />;
      });
    }

    return (
      <div>
        <Typography variant="h4" className="title">
          Logbooks
        </Typography>
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
  logbooks: state.logbooks.logbooks,
  users: state.users,
});

export default connect(mapStateToProps, { getAllLogbooks })(Logbooks);
