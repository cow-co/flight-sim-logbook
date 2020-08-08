const { Component } = require("react");
import List from "@material-ui/core/List";
import LogbookSummary from "../../components/LogbookSummary";
import { getAllLogbooks } from "../../redux/actions/logbook-actions";

class Logbooks extends Component {
  constructor(props) {
    super(props);
    this.props.getAllLogbooks();
  }
  render() {
    // TODO Populate the list
    return (
      <List>
        {this.props.logbooks.forEach((logbook) => {
          <LogbookSummary username={this.props.users.username} logbook={logbook} />;
        })}
      </List>
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
