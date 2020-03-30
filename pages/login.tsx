import React from "react";
import Router from "next/router";
import Link from "next/link";
import host from '../helpers/host';
import { throws } from "assert";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    error: undefined,
    success: undefined
  };

  constructor(props: any) {
    super(props);
    // … Other code goes here

    // Bind your handler in the constructor to create
    // a single bound function
    this.emailChange = this.emailChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({width: window.innerWidth});
  };

  emailChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({email: event.target.value})
  }

  passwordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({password: event.target.value})
  }

  handleSubmit(event: React.FormEvent) {
    fetch(`${host}/auth/login`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      }) // body data type must match "Content-Type" header
    }).then((res) => res.json()).then((data) => {
      if (!data.success) {
        this.setState({
          error: data.error || "Internal Server Error"
        });
        return;
      }
      this.setState({
        success: "Logged In"
      });
      localStorage.setItem("token", data.token || "");
    })
    .catch((e) => {
      console.log(e)
      this.setState({
        error: "Internal Server Error"
      });
    })
    event.preventDefault();
  }

  render() {
    let error;
    if (this.state.error) {
      error = <h1 className="text-red">{this.state.error}</h1>
    }
    let success;
    if (this.state.success) {
      error = <h1 className="text-red">{this.state.success}</h1>
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input type="text" value={this.state.email} onChange={this.emailChange} />
          </label>
          <label>
            Password:
            <input type="text" value={this.state.password} onChange={this.passwordChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {error}
        {success}
      </div>
    );
  }
}

export default Login;

