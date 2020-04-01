import React from "react";
import Router from "next/router";
import Link from "next/link";
import host from '../helpers/host';
import { throws } from "assert";

class Login extends React.Component {
  state = {
    authenticated: undefined,
    loaded: false
  }

  constructor(props: any) {
    super(props);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    const token = localStorage.getItem("token");
    this.setState({
      authenticated: token != "" && token != undefined,
      loaded: true 
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({width: window.innerWidth});
  };

  render() {

    let body;

    if (this.state.loaded) {
      body = (
        <div className="flex flex-col h-screen">
          <div className="flex items-center justify-between flex-wrap p-6 h-24 w-full bg-gray-200">
            <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>
                <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                      height="512" viewBox="0 0 512 512">
                    <path id="ED" className="cls-1"
                          d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                </svg>
                <span className="font-medium text-xl tracking-tight">Accounts</span>
            </div>
            <div className="bg-gray-600 rounded-md border text-center shadow transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md cursor-pointer" onClick={() => Router.push(this.state.authenticated ? "/logout": "/login" )}>
              <p className="font-semibold text-gray-100 m-2 mx-5">{this.state.authenticated ?  "Logout": "Login"}</p>
            </div>
        </div>
      </div>
      )
    }

    return (
      <div className="flex flex-col h-screen bg-gray-200">
        {body}
      </div>
    );
  }
}

export default Login;

