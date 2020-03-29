import React from "react"
import Router from "next/router"
import Link from "next/link"

class Login extends React.Component {
    state = {
      value: ""
    };

    constructor(props: any) {
      super(props);
      // … Other code goes here

      // Bind your handler in the constructor to create
      // a single bound function
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    componentDidMount() {
        console.log(localStorage.getItem("token"))
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({width: window.innerWidth});
    };

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      console.log(event.target.value)
      this.setState({value: event.target.value})
    }

    handleSubmit(event: React.FormEvent) {
      localStorage.setItem("token", this.state.value as string || "");
      event.preventDefault();
    }

    render() {
        return (
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        );
    }
}

export default Login;

