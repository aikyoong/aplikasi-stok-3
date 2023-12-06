import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./core/routes2";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const rootElement = document.getElementById("root");
const queryClient = new QueryClient();

if (rootElement) {
  // Periksa apakah rootElement ada sebelum mengaksesnya
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          {/* <QueryRouterApp /> */}
          <RouterProvider router={router} />
        </StrictMode>
      </QueryClientProvider>
    );
  }
}
