import React from "react";
import "./App.css";
import HeaderBar from "./common/components/HeaderBar";
import { ThemeProvider, createMuiTheme, CssBaseline, Container } from "@material-ui/core";
import Frontpage from "./common/pages/Frontpage";
import { BrowserRouter, Route } from "react-router-dom";
import AlertBar from "./common/components/AlertBar";
import Login from "./users/pages/Login";
import Logbooks from "./logbooks/pages/Logbooks";
import Logbook from "./logbooks/pages/Logbook";
import RegisterUser from "./users/pages/RegisterUser";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#648dae",
      dark: "#648dae",
    },
    secondary: {
      main: "#aa647b",
      dark: "#aa647b",
    },
    error: {
      main: "#d32f2f",
      dark: "#d32f2f",
    },
    warning: {
      main: "#f57c00",
      dark: "#f57c00",
    },
    info: {
      main: "#1976d2",
      dark: "#1976d2",
    },
    success: {
      main: "#388e3c",
      dark: "#388e3c",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <HeaderBar />
        <Container>
          <AlertBar />
          <Route path="/" exact component={Frontpage} />
          <Route path="/users/login" exact component={Login} />
          <Route path="/users/register" exact component={RegisterUser} />
          <Route path="/logbooks/all" exact component={Logbooks} />
          <Route path="/logbooks/*/*" component={Logbook} />
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
