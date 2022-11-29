import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/hoaxify.png";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function NavBar() {
  const { t } = useTranslation();
  // const auth = useContext(AuthContext);
  const auth = useSelector((store) => store);

  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/" title="Home">
          <img src={logo} alt="Hoaxify" width="60" />
          Hoaxify
        </Link>
        <ul className="navbar-nav">
          {!auth.isLoggedIn && (
            <>
              <Link className="nav-link" to="/signup">
                {t("signUp")}
              </Link>
              <Link className="nav-link" to="/login">
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
  );
}

export default NavBar;

// ===== Suitable for class components - connecting state without hooks =========
// const mapStateToProps = (store) => {
//   return store;
// };
// export default connect(mapStateToProps)(NavBar);
