import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./routes";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store,persistor } from "./redux/store";
import { ThemeProvider } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import CONFIG_KEYS from "./config";
import { PersistGate } from "redux-persist/integration/react";

// Clean up potentially corrupted localStorage data on app startup
try {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    // Check for chat-related keys that might have corrupted data
    if (key.includes('chat_') || key.includes('course_chat_') || key.includes('student_chat_') || key.includes('instructor_chat_')) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          // If it's not a valid array, clear it
          if (!Array.isArray(parsed)) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        // If parsing fails, clear it
        localStorage.removeItem(key);
      }
    }
  });
} catch (error) {
  console.error("Error cleaning up localStorage:", error);
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
Modal.setAppElement("#root");

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CONFIG_KEYS.GOOGLE_AUTH_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <RouterProvider router={AppRouter} />
            <ToastContainer />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
