import React from "react";
import Input from "../components/Input";
import { withTranslation } from "react-i18next";
import { signup } from "../api/apiCalls";
import Alert from "../components/Alert";
import ButtonWithProgress from "../components/ButtonWithProgress";

//==== CLASS COMPONENT =====
class SignUpPage extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signUpSuccess: false,
    errors: {},
  };

  onChange = (event) => {
    const { id, value } = event.target;
    // const errorsCopy = JSON.parse(JSON.stringify(this.state.errors)); DEEP COPY
    const errorsCopy = { ...this.state.errors };
    delete errorsCopy[id];
    this.setState({
      [id]: value,
      errors: errorsCopy,
    });
  };

  submit = async (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    //============== FETCH ==============
    // fetch("/api/1.0/users", {
    //   method: "POST",
    //   header: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });

    //============= AXIOS ==============
    this.setState({ apiProgress: true });
    try {
      await signup(body);
      this.setState({ signUpSuccess: true });
    } catch (error) {
      if (error.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
      }
      this.setState({ apiProgress: false });
    }
  };

  render() {
    const { t } = this.props;
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signUpSuccess, errors } =
      this.state;
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }

    let passwordMismatch =
      password !== passwordRepeat ? t("passwordMismatchValidation") : "";
    return (
      <div
        className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
        data-testid="signup-page"
      >
        {!signUpSuccess && (
          <form className="card" data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">{t("signUp")}</h1>
            </div>
            <div className="card-body">
              <Input
                id="username"
                label={t("username")}
                onChange={this.onChange}
                help={errors.username}
              />

              <Input
                id="email"
                label={t("email")}
                onChange={this.onChange}
                help={errors.email}
              />

              <Input
                id="password"
                label={t("password")}
                type="password"
                onChange={this.onChange}
                help={errors.password}
              />

              <Input
                id="passwordRepeat"
                label={t("passwordRepeat")}
                type="password"
                onChange={this.onChange}
                help={passwordMismatch}
              />

              <div className="text-center">
                <ButtonWithProgress
                  apiProgress={apiProgress}
                  onClick={this.submit}
                  disabled={disabled}
                >
                  {t("signUp")}
                </ButtonWithProgress>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <Alert>Please check your e-mail to activate your account</Alert>
        )}
      </div>
    );
  }
}

const SignUpPageWithTranslation = withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;
