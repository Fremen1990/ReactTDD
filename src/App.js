import { createContext, useState } from "react";
import SignUpPage from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AccountActivationPage from "./pages/AccountActivationPage";
import NavBar from "./components/NavBar";

export const AuthContext = createContext();

function App() {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: "",
  });

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        onLoginSuccess: setAuth,
      }}
    >
      <Router>
        <div className="container pt-3">
          <NavBar />

          <Route exact path="/" component={HomePage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/user/:id" component={UserPage} />
          <Route path="/activate/:token" component={AccountActivationPage} />

          <LanguageSelector />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
