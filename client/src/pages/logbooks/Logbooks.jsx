const { Component } = require("react");
import List from "@material-ui/core/List";
import { getAllLogbooks } from "../../redux/actions/logbook-actions";

class Logbooks extends Component {
  constructor(props) {
    super(props);
    this.props.getAllLogbooks();
  }
  render() {
    // TODO Populate the list
    return <List></List>;
  }
}

Logbooks.propTypes = {
  getAllLogbooks: PropTypes.func.isRequired,
  logbooks: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  logbooks: state.users,
});

export default connect(mapStateToProps, { getAllLogbooks })(Logbooks);
