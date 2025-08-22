import { HashRouter } from "react-router-dom";
import App from "./App";
import ReactDOM from "react-dom/client";
import React from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
