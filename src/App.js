import SignUpPage from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { useTranslation } from "react-i18next";
import logo from "./assets/hoaxify.png";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AccountActivationPage from "./pages/AccountActivationPage";
import { useState } from "react";

function App() {
  const { t } = useTranslation();

  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: "",
  });

  // const [path, setPath] = useState(window.location.pathname);

  // const onClickLink = (event) => {
  //   event.preventDefault();
  //   const path = event.currentTarget.attributes.href.value;
  //   window.history.pushState({}, "", path);
  //   setPath(path);
  // };

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <Link
            className="navbar-brand"
            to="/"
            title="Home"
            // onClick={onClickLink}
          >
            <img src={logo} alt="Hoaxify" width="60" />
            Hoaxify
          </Link>
          <ul className="navbar-nav">
            {!auth.isLoggedIn && (
              <>
                <Link
                  className="nav-link"
                  to="/signup"
                  // onClick={onClickLink}
                >
                  {t("signUp")}
                </Link>
                <Link
                  className="nav-link"
                  to="/login"
                  // onClick={onClickLink}
                >
                  Login
                </Link>
              </>
            )}
            {auth.isLoggedIn && (
              <Link className="nav-link" to={`/user/${auth.id}`}>
                My Profile
              </Link>
            )}
          </ul>
        </div>
      </nav>

      <div className="container pt-3">
        {/*// Old JS routing*/}
        {/*{window.location.pathname === "/" && <HomePage />}*/}
        {/*{window.location.pathname === "/signup" && <SignUpPage />}*/}
        {/*{window.location.pathname === "/login" && <LoginPage />}*/}
        {/*{window.location.pathname.startsWith("/user/") && <UserPage />}*/}
        {/*{path === "/" && <HomePage />}*/}
        {/*{path === "/signup" && <SignUpPage />}*/}
        {/*{path === "/login" && <LoginPage />}*/}
        {/*{path.startsWith("/user/") && <UserPage />}*/}

        <Route exact path="/" component={HomePage} />
        <Route path="/signup" component={SignUpPage} />
        <Route
          path="/login"
          render={(reactRouterProps) => {
            return <LoginPage {...reactRouterProps} onLoginSuccess={setAuth} />;
          }}
        />
        <Route path="/user/:id" component={UserPage} />
        <Route path="/activate/:token" component={AccountActivationPage} />

        <LanguageSelector />
      </div>
    </Router>
  );
}

export default App;
