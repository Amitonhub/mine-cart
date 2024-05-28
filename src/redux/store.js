import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginSlice';
import { api } from './api';

const store = configureStore({
  reducer: {
    login: loginReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;