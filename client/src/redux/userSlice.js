import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  const storedUser = JSON.parse(window?.localStorage.getItem("userInfo")) ?? {};

  if (storedUser?.user && storedUser?.token) {
    const normalizedUser = { token: storedUser.token, ...storedUser.user };
    localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
    return normalizedUser;
  }

  return storedUser;
};

const initialState = {
  user: getStoredUser(),
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem("userInfo");
    },
  },
});

export default userSlice.reducer;

export function Login(user) {
  return (dispatch) => {
    dispatch(userSlice.actions.login({user}));
  };
}

export function Logout() {
  return (dispatch) => {
    dispatch(userSlice.actions.logout());
  };
}
