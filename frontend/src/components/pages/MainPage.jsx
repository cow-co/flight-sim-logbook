import { Box, Typography } from "@mui/material";
import AlertsBar from "../elements/common/AlertsBar";
import { useState } from "react";
import HeaderBar from "../elements/common/HeaderBar";
import RegistrationForm from "../elements/users/RegistrationForm";
import LoginForm from "../elements/users/LoginForm";
import LogbookTable from "../elements/logbooks/LogbookTable";

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
        <Typography variant="h2">Logbook</Typography>
        <LogbookTable />
      </Box>
      <AlertsBar />
    </>
  );
}

export default MainPage;
