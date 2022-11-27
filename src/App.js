import SignUpPage from "./pages/SignUpPage";
import LanguageSelector from "./components/LanguageSelector";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import { Route } from "react-router-dom";
import AccountActivationPage from "./pages/AccountActivationPage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <div className="container pt-3">
        <Route exact path="/" component={HomePage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/user/:id" component={UserPage} />
        <Route path="/activate/:token" component={AccountActivationPage} />
        <LanguageSelector />
      </div>
    </>
  );
}

export default App;
