import { createSlice } from "@reduxjs/toolkit";

// Central store for keeping track of what user is logged in
export const usersSlice = createSlice({
  name: "users",
  initialState: {
    userId: "",
    token: "",
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setUserId, setToken } = usersSlice.actions;
export default usersSlice.reducer;
