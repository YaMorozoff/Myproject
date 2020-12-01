import "./index.less";
import React from "react";
import { render } from "react-dom";
import App from "./pages/App";
import Provider from "react-redux/lib/components/Provider";
import { store } from "./reducers";
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);