import { Box, Grid } from "@mui/material";
import AlertsBar from "../elements/common/AlertsBar";
import { useState } from "react";
import HeaderBar from "../elements/common/HeaderBar";
import RegistrationForm from "../elements/users/RegistrationForm";
import LoginForm from "../elements/users/LoginForm";

function MainPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <HeaderBar
          handleLoginFormOpen={() => setLoginOpen(true)}
          handleRegisterFormOpen={() => setRegisterOpen(true)}
        />
        <LoginForm open={loginOpen} onClose={() => setLoginOpen(false)} />
        <RegistrationForm
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </Box>
      <AlertsBar />
    </>
  );
}

export default MainPage;
