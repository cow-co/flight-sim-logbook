import React from "react";
import "./App.css";
import HeaderBar from "./components/common/HeaderBar";
import { ThemeProvider, createMuiTheme, CssBaseline, Container } from "@material-ui/core";
import Frontpage from "./pages/Frontpage";
import { BrowserRouter, Route } from "react-router-dom";
import AlertBar from "./components/common/AlertBar";
import Login from "./pages/users/Login";
import RegisterUser from "./pages/users/RegisterUser";

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
          <Route path="/logbooks/*/*" component={Logbook} />
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
