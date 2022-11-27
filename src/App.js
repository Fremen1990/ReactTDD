import SignUpPage from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AccountActivationPage from "./pages/AccountActivationPage";
import { useState } from "react";
import NavBar from "./components/NavBar";

function App() {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: "",
  });

  return (
    <Router>
      <div className="container pt-3">
        <NavBar auth={auth} />

        <Route exact path="/" component={HomePage} />
        <Route path="/signup" component={SignUpPage} />
        <Route
          path="/login"
          render={(reactRouterProps) => {
            return <LoginPage {...reactRouterProps} onLoginSuccess={setAuth} />;
          }}
        />
        <Route
          path="/user/:id"
          component={(reactRouterProps) => (
            <UserPage {...reactRouterProps} auth={auth} />
          )}
        />
        <Route path="/activate/:token" component={AccountActivationPage} />

        <LanguageSelector />
      </div>
    </Router>
  );
}

export default App;
