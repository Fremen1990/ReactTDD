import React from "react";
import axios from "axios";

//=== FUNCTIONAL COMPONENT ====
// const SignUpPage = ()=>{
//     return(
//         <h1>Sign Up</h1>
//     )
// }

//==== CLASS COMPONENT =====
class SignUpPage extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signUpSuccess: false,
  };

  onChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
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
    try {
      this.setState({ apiProgress: true });
      await axios.post("/api/1.0/users", body).then(() => {
        this.setState({ signUpSuccess: true });
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signUpSuccess } = this.state;
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }
    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {!signUpSuccess && (
          <form className="card mt-5" data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">Sign Up</h1>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  className="form-control"
                  id="username"
                  onChange={this.onChange}
                  // placeholder="username"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  E-mail
                </label>
                <input
                  className="form-control"
                  id="email"
                  type="email"
                  onChange={this.onChange}
                  // placeholder="email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  className="form-control"
                  id="password"
                  type="password"
                  onChange={this.onChange}
                  // placeholder="email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="passwordRepeat">
                  Password Repeat
                </label>
                <input
                  className="form-control"
                  id="passwordRepeat"
                  type="password"
                  onChange={this.onChange}
                  // placeholder="email"
                />
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={this.submit}
                  disabled={disabled || apiProgress}
                >
                  {apiProgress ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  ) : null}
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <div className="alert alert-success mt-3">
            Please check your e-mail to activate your account
          </div>
        )}
      </div>
    );
  }
}

export default SignUpPage;
