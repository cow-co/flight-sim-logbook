import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users-slice";
import alertsReducer from "./alerts-slice";

export default configureStore({
  reducer: {
    alerts: alertsReducer,
    users: usersReducer,
  },
});
