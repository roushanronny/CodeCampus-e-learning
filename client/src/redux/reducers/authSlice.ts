import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import decodeJwtToken from "../../utils/decode";

// Safely get tokens from localStorage
const getAccessToken = (): string | null => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // If token is stored as JSON, parse it
      try {
        const parsed = JSON.parse(token);
        return parsed.accessToken || token;
      } catch {
        return token;
      }
    }
    return null;
  } catch {
    return null;
  }
};

const getRefreshToken = (): string | null => {
  try {
    const token = localStorage.getItem('refreshToken');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        return parsed.refreshToken || token;
      } catch {
        return token;
      }
    }
    return null;
  } catch {
    return null;
  }
};

const accessToken = getAccessToken();
const refreshToken = getRefreshToken();
const decodedToken = accessToken ? decodeJwtToken(accessToken) : null;

const initialState = {
  data: {
    accessToken:accessToken,
    refreshToken,
  },
  isLoggedIn: accessToken ? true : false,
  userType:decodedToken?.payload?.role
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string ,userType:string}>
    ) {
      localStorage.setItem(
        "accessToken",
        JSON.stringify({
          accessToken: action.payload.accessToken,
        })
      );
      localStorage.setItem(
        "refreshToken",
        JSON.stringify({
          refreshToken: action.payload.refreshToken,
        })
      );
      state.data = {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
      state.isLoggedIn = true;
      state.userType=action.payload.userType
    },
    clearToken(state) {
      state.data = {
        accessToken: "",
        refreshToken: "",
      };
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.isLoggedIn = false;
      state.userType=""
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth.data;

export const selectAccessToken = (state:RootState)=> {
  const accessTokenString: string | null = state.auth.data.accessToken;
  const accessToken = JSON.parse(accessTokenString ?? "")?.accessToken || "";
  return accessToken;
}
export const selectIsLoggedIn = () => {
  const  accessToken = localStorage.getItem("accessToken");
  return accessToken ? true : false;
};

export const selectUserType = (state:RootState)=>state.auth.userType

export const authReducer = authSlice.reducer;
