import React from "react";
import { TextField, Button, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { login } from "../redux/user-actions";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isLoggedIn } from "../../common/helpers/utils";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
    this.updateField = this.updateField.bind(this);
    this.sendLogin = this.sendLogin.bind(this);
  }

  updateField = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
    });
  };

  sendLogin = async (event) => {
    event.preventDefault();
    await this.props.login(this.state);
    if (this.props.users.isLoggedIn) {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <div className="full-page-form">
        <Typography variant="h4" className="title">
          Login
        </Typography>
        <form onSubmit={this.sendLogin}>
          <Grid
            className="group-list-grid"
            container
            spacing={3}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <TextField
                className="full-page-text-field"
                id="username"
                label="Username"
                value={this.state.username}
                onChange={this.updateField}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                className="full-page-text-field"
                type="password"
                id="password"
                label="Password"
                value={this.state.password}
                onChange={this.updateField}
                required
              />
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" color="primary" type="submit">
                Log In
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps, { login })(Login);
