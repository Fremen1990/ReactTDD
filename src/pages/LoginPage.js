import Input from "../components/Input";
import React, { useContext, useEffect, useState } from "react";
import { login } from "../api/apiCalls";
import Alert from "../components/Alert";
import { useTranslation } from "react-i18next";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { AuthContext } from "../state/AuthContextWrapper";

const LoginPage = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiProgress, setApiProgress] = useState(false);
  const [failMessage, setFailMessage] = useState(undefined);

  const auth = useContext(AuthContext);

  const { t } = useTranslation();

  const submit = async (event) => {
    event.preventDefault();
    setApiProgress(true);
    try {
      const response = await login({ email, password });
      history.push("/");
      auth.onLoginSuccess({
        isLoggedIn: true,
        id: response.data.id,
      });
    } catch (error) {
      setFailMessage(error.response.data.message);
    }
    setApiProgress(false);
  };

  useEffect(() => {
    setFailMessage(undefined);
  }, [email, password]);

  let disabled = !(email && password);

  return (
    <div
      className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
      data-testid="login-page"
    >
      <form className="card">
        <div className="card-header">
          <h1 className="text-center">{t("login")}</h1>
        </div>
        <div className="card-body">
          <Input
            id="email"
            label={t("email")}
            type="text"
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            id="password"
            label={t("password")}
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          {failMessage && <Alert type="danger">{t("failMessage")}</Alert>}
          <div className="text-center">
            <ButtonWithProgress
              apiProgress={apiProgress}
              onClick={submit}
              disabled={disabled}
            >
              {t("login")}
            </ButtonWithProgress>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
