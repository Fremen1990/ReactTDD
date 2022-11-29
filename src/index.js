import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./locale/i18n";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import createStore from "./state/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode> // commented to use react-router-dom@5.3.0 for Class and Functional components as a learning path

  <Router>
    {/*== REDUX PROVIDER ==*/}
    <Provider store={createStore()}>
      <App />
    </Provider>
  </Router>

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//TODO 69. Use Redux in NavBar  3:00
