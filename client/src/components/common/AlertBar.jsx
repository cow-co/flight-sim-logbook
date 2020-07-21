import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";

class AlertBar extends Component {
  render() {
    const alerts = this.props.alerts;

    if (alerts !== undefined && alerts !== null && alerts.length > 0) {
      return alerts.map((alert) => {
        return (
          <Alert key={alert.id} severity={alert.alertType} className="alertBar">
            {alert.msg}
          </Alert>
        );
      });
    } else {
      return <div></div>;
    }
  }
}

AlertBar.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.common,
});

export default connect(mapStateToProps)(AlertBar);
