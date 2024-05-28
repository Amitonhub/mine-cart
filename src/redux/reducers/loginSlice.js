import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    isLogin: false,
  },
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setIsLogin, setUserDetails } = loginSlice.actions;

export default loginSlice.reducer;