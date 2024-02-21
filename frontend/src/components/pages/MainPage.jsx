import { Box, Grid } from "@mui/material";
import AlertsBar from "../elements/common/AlertsBar";
import { useState } from "react";
import HeaderBar from "../elements/common/HeaderBar";

function MainPage() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <HeaderBar />
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
