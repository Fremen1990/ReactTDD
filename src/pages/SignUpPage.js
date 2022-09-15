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
    password: "",
    passwordRepeat: "",
  };

  onChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
    });
  };

  submit = (event) => {
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
    axios.post("/api/1.0/users", body);
  };

  render() {
    let disabled = true;
    const { password, passwordRepeat } = this.state;
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }
    return (
      <div>
        <form>
          <h1>Sign Up</h1>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            onChange={this.onChange}
            // placeholder="username"
          />
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            onChange={this.onChange}
            // placeholder="email"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            onChange={this.onChange}
            // placeholder="email"
          />
          <label htmlFor="passwordRepeat">Password Repeat</label>
          <input
            id="passwordRepeat"
            type="password"
            onChange={this.onChange}
            // placeholder="email"
          />
          <button onClick={this.submit} disabled={disabled}>
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}

export default SignUpPage;
