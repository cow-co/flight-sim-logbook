import { useState } from "react";
import {
  FormControl,
  Dialog,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { login } from "../../../common/api-calls";
import { useDispatch } from "react-redux";
import { setUserId, setToken } from "../../../common/redux/users-slice";
import {
  createErrorAlert,
  createSuccessAlert,
} from "../../../common/redux/dispatchers";

const LoginForm = ({ onClose, open }) => {
  const [currentUsername, setCurrentUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleClose = () => {
    setCurrentUsername("");
    setPassword("");
    onClose();
  };

  const handleSubmit = async () => {
    const response = await login(currentUsername, password);
    if (response.errors.length > 0) {
      createErrorAlert(response.errors);
    } else {
      createSuccessAlert("Successfully logged in");
      dispatch(setToken(response.token));
      dispatch(setUserId(response.user.id));
      localStorage.setItem("token", response.token);
      handleClose();
    }
  };

  const handleUsernameUpdate = (event) => {
    setCurrentUsername(event.target.value);
  };

  const handlePasswordUpdate = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Dialog
      className="form-dialog"
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Login</DialogTitle>
      <FormControl fullWidth>
        <TextField
          className="text-input"
          label="Username"
          variant="outlined"
          value={currentUsername}
          onChange={handleUsernameUpdate}
        />
        <TextField
          type="password"
          className="text-input"
          label="Password"
          variant="outlined"
          value={password}
          onChange={handlePasswordUpdate}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </FormControl>
    </Dialog>
  );
};

export default LoginForm;
