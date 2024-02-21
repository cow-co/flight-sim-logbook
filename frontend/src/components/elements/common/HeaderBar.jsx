import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { checkToken, logout } from "../../../common/api-calls";
import { setUserId, setToken } from "../../../common/redux/users-slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  createErrorAlert,
  createSuccessAlert,
} from "../../../common/redux/dispatchers";

const HeaderBar = ({ handleLoginFormOpen, handleRegisterFormOpen }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.userId);

  useEffect(() => {
    const checkSession = async () => {
      const res = await checkToken();
      if (res.errors.length > 0) {
        createErrorAlert(res.errors);
        dispatch(setUserId(""));
        dispatch(setToken(""));
      } else {
        dispatch(setUserId(res.userId));
      }
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    const { errors } = await logout();
    if (errors.length > 0) {
      createErrorAlert(errors);
    } else {
      createSuccessAlert("Successfully logged out");
      dispatch(setUserId(""));
      dispatch(setToken(""));
      localStorage.removeItem("token");
    }
  };

  let loginoutButton = <Button onClick={handleLoginFormOpen}>Log In</Button>;
  if (userId) {
    loginoutButton = <Button onClick={handleLogout}>Log Out</Button>;
  }

  let registerButton = userId ? null : (
    <Button onClick={handleRegisterFormOpen}>Register</Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button component={RouterLink} to={"/"}>
            Logbook
          </Button>
        </Typography>
        {registerButton}
        {loginoutButton}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
