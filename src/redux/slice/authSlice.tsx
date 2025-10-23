import { adminInitialState } from "@/constants/adminData";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: adminInitialState,
};

export const Authslice = createSlice({
  name: "AuthSlice",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.admin = action.payload;
    },
    logout: (state) => {
      state.admin = initialState.admin;
    },
    auth: (state) => {
      state.admin;
    },
  },
});

export const { login, logout, auth } = Authslice.actions;
export default Authslice.reducer;
