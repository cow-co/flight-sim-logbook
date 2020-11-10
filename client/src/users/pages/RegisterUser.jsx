import React from "react";
import Typography from "@material-ui/core/Typography";

import { TextField, Button, Grid } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import { connect } from "react-redux";
import { registerUser } from "../redux/user-actions";
import PropTypes from "prop-types";

class RegisterUser extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
      confirmationError: "",
    };
    this.updateField = this.updateField.bind(this);
    this.sendRegister = this.sendRegister.bind(this);
  }

  updateField = (event) => {
    event.preventDefault();
    const { id, value } = event.target;

    if (id === "passwordConfirmation") {
      if (value !== this.state.password) {
        this.setState({ confirmationError: "Password confirmation should match!" });
      } else {
        this.setState({ confirmationError: "" });
      }
    }

    this.setState({
      [id]: value,
    });
  };

  sendRegister = async (event) => {
    event.preventDefault();
    if (this.state.confirmationError === "" && this.state.password !== "" && this.state.username !== "") {
      const data = {
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        passwordConfirmation: this.state.passwordConfirmation,
      };
      await this.props.registerUser(data);
    }
  };

  render() {
    return (
      <div className="full-page-form">
        <Typography variant="h4" className="title">
          Register an Account
        </Typography>
        <form onSubmit={this.sendRegister}>
          <Grid
            className="register-user-grid"
            container
            spacing={3}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <TextField
                className="full-page-text-field"
                type="email"
                id="email"
                label="Email"
                value={this.state.email}
                onChange={this.updateField}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                className="full-page-text-field"
                type="text"
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
              <TextField
                className="full-page-text-field"
                type="password"
                id="passwordConfirmation"
                label="Password Confirmation"
                value={this.state.passwordConfirmation}
                onChange={this.updateField}
                required
              />
            </Grid>
            <Grid item>
              {this.state.confirmationError !== "" && <Alert severity="warning">{this.state.confirmationError}</Alert>}
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" color="primary" type="submit">
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

RegisterUser.propTypes = {
  registerUser: PropTypes.func.isRequired,
};

export default connect(null, { registerUser })(RegisterUser);
