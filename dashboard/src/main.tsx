import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "@/app/provider";
import { AppRouter } from "@/app/routes";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </React.StrictMode>,
  );
}
