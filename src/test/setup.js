import React from "react";
import { render } from "@testing-library/react";
// import AuthContextWrapper from "../state/AuthContextWrapper";
import { BrowserRouter as Router } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import createStore from "../state/store";
import { Provider } from "react-redux";

const RootWrapper = ({ children }) => {
  return (
    <Router>
      {/*<AuthContextWrapper>*/}
      <Provider store={createStore()}>
        {children}
        <LanguageSelector />
      </Provider>
      {/*</AuthContextWrapper>*/}
    </Router>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: RootWrapper, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };

// https://testing-library.com/docs/react-testing-library/setup/
