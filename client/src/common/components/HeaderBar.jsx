// The header bar at the top of the page, has things like login/logout links etc.
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import "./HeaderBar.css";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../helpers/utils";
import { logout, checkLoginStatus } from "../../users/redux/user-actions";

import { connect } from "react-redux";
import PropTypes from "prop-types";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.sendLogout = this.sendLogout.bind(this);
  }

  componentDidMount() {
    this.props.checkLoginStatus();
  }

  sendLogout = async (event) => {
    event.preventDefault();
    await this.props.logout();
  };

  render() {
    let loginDependentElements = (
      <div>
        <Button color="inherit">
          <Link to="/users/register">Register</Link>
        </Button>
        <Button color="inherit">
          <Link to="/users/login">Login</Link>
        </Button>
      </div>
    );

    if (this.props.users.isLoggedIn) {
      loginDependentElements = (
        <div>
          <Button color="inherit" onClick={this.sendLogout}>
            Logout {this.props.users.username}
          </Button>
          <Button color="inherit">
            <Link to="/logbooks/all">Logbooks</Link>
          </Button>
        </div>
      );
    }

    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="logo">
            <Link to="/">Flight Sim Logbook</Link>
          </Typography>
          {loginDependentElements}
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  checkLoginStatus: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { logout, checkLoginStatus })(Header);
