import React from "react";
import Router from "next/router";
import Link from "next/link";
import host from '../helpers/host';
import { throws } from "assert";
import Nav from "../components/Nav";
import AntiPrivateRoute from "../components/AntiPrivateRoute";

class Forgot extends React.Component {
  state = {
    email: "",
    error: undefined,
    success: undefined
  };

  constructor(props: any) {
    super(props);
    // … Other code goes here

    // Bind your handler in the constructor to create
    // a single bound function
    this.emailChange = this.emailChange.bind(this);
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

  handleSubmit(event: React.FormEvent) {
    fetch(`${host}/reset-pw`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        email: this.state.email
      }) // body data type must match "Content-Type" header
    }).then((res) => res.json()).then((data) => {
      if (!data.success) {
        this.setState({
          error: data.error || "Internal Server Error"
        });
        return;
      }
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
      <div className="flex flex-col h-screen">
        <div className="absolute flex items-center justify-between flex-wrap p-6 h-24 w-full bg-gray-200">
            <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>

                <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                      height="512" viewBox="0 0 512 512">
                    <path id="ED" className="cls-1"
                          d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                </svg>
                <span className="font-medium text-xl tracking-tight">Accounts</span>
            </div>
        </div>
        <div className="flex flex-grow bg-gray-200 p-4 rotate">
          <div className="sm:max-w-xl md:max-w-2xl w-full m-auto">
            <div className="flex items-stretch bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500 sm:border-0">
              <div className="flex hidden overflow-hidden relative sm:block w-5/12 md:w-6/12 bg-gray-600 text-gray-300 pb-4 bg-cover bg-center">
              <img className="object-cover w-full h-percent-110 absolute m-0 z--1 top-0 left-0" src="../forgotBanner.png" />
                <div className="flex-1 absolute top-0 text-white p-5">
                <svg className="fill-current text-black dark:text-white h-12 w-12" xmlns="http://www.w3.org/2000/svg" width="512"
                         height="512" viewBox="0 0 512 512">
                        <path id="ED" className="cls-1"
                              d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                    </svg>
                </div>  
                <div className="flex-1 absolute bottom-0 text-white p-5">
                  <h3 className="text-4xl font-bold inline-block">Forgot</h3>
                  <p className="text-white whitespace-no-wrap">
                    Password
                  </p>
                </div>
                <svg className="absolute animate h-full w-4/12 sm:w-2/12 right-0 inset-y-0 fill-current text-white" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <polygon points="0,0 100,100 100,0" />
                </svg>
              </div>
              <div className="flex-1 p-6 sm:p-10 sm:py-12 sm:pb-6">
                <h3 className="text-xl text-gray-700 font-bold mb-6">Password <span className="text-lg text-gray-500 font-normal">Recovery</span></h3>
                <input type="text"  value={this.state.email} onChange={this.emailChange} className="px-3 w-full py-2 bg-gray-200 border border-gray-200 rounded focus:border-gray-400 focus:outline-none focus:bg-white mb-4" placeholder="Email" />
                <div className="flex flex-wrap items-center">
                  <div className="w-full sm:flex-1">
                    <input onClick={this.handleSubmit} type="submit" value="Reset" className="w-full sm:w-auto bg-indigo-500 text-indigo-100 px-6 py-2 rounded hover:bg-indigo-600 focus:outline-none cursor-pointer transition duration-200 ease-in transform hover:scale-110"/>
                  </div>
                  <div className="text-sm text-gray-500 hover:text-gray-700 pt-4 sm:p-0">
                    <Link href="/forgot-pw">
                      <a>Remember?</a>
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-gray-500 hover:text-gray-700 pt-4 mt-3 sm:p-0">
                    <Link href="/register">
                      <a>Need an Account?</a>
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AntiPrivateRoute(Forgot);

