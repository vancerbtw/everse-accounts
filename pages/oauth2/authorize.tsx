import React from "react";
import host from '../../helpers/host';
import fetch from 'isomorphic-unfetch';
import Nav from "../../components/Nav";
import Link from 'next/link';
import { PrivateRoute } from "../../components/PrivateRoute"; //importing PrivateRoute to wrap our component export so it will require authentication

//the verification response of our api describing the Legitimacy of the oauth request
interface Oauth2Application {
  name?: string;
  redirect_uris?: string[];
  scopes?: string[];
  disabled?: Boolean;
  token: string;
};

interface AuthResponse {
  success: Boolean;
  error?: string;
  application?: Oauth2Application;
};



// the user schema of user that is logged in
interface User {
  success: Boolean,
  name?: string,
  email?: string,
  verified?: Boolean,
  disabled?: Boolean
};

//props recieving in component
type AuthProps = {
  querys: URLSearchParams,
  response: AuthResponse,
  user: User
};

type AuthState = {
  response?: AuthResponse,
  error?: string,
  success?: string
}


class Authorization extends React.Component<AuthProps, AuthState> {
  constructor(props: any) {
    super(props);

    this.state = {
      response: undefined,
      error: undefined,
      success: undefined
    };
  }

  componentDidMount() {
    fetch(`${host}/api/oauth2/authorize/verify`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        client_id: this.props.querys.get("client_id"),
        redirect_uri: this.props.querys.get("redirect_uri"),
        scopes: (this.props.querys.get("scopes") as string).split(" ")
      }) // body data type must match "Content-Type" header
    }).then((res) => res.json()).then((data: AuthResponse) => {
      this.setState({
        response: data
      });
    });
  }

  render() {
    let error;
    //making sure all valid query parameters are present in url of request
    if (!this.props.querys.get("client_id"))  error = "Missing Client ID";
    if (!this.props.querys.get("redirect_uri")) error = "Missing Redirect URI";
    if (this.props.querys.get("scopes")) error = "Missing Client ID";
    
    //returning if the response is present and the success value of it is false because of error
    let mainView;

    if (this.state.response) {
      let body;
      let title;
      
      if (this.state.response.error) {
        const err = error || this.state.error;

        body = (
          <div className="w-full flex flex-row my-6">
            <div className="text-gray-400 inline-block w-24 h-24 text-gray-400 mx-auto">
              <svg className="absolute" width="6rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                  <defs>
                      <rect id="a" x="0" y="0" width="80" height="80" rx="40"/>
                  </defs>
                  <g fill="none" fill-rule="evenodd">
                      <g transform="translate(6 6)">
                          <use stroke-opacity=".2" stroke="#545454" stroke-width="6" href="#a"/>
                          <use href="#a"/>
                      </g>
                      <path d="M46.5 51.887L32.044 66 27 60.609l13.99-14.102L27 32.85 32.66 27 46.5 40.952 60.34 27 66 32.85 52.01 46.507 66 60.61 60.956 66 46.5 51.887z" fill="#545454"/>
                  </g>
              </svg>
            </div>
          </div>
        );
        title = (
          <h3 className="text-xl text-gray-700 font-bold mb-2">Error  <span className="text-lg text-gray-500 font-semibold">|</span> <span className="text-lg text-gray-500 font-normal">{err}</span></h3>       
        );
      }

      if (this.state.response.success) {
        body = (
          <div>
            <h3 className="text-base text-gray-700 font-semibold mt-2">Information<span className="text-sm text-gray-500 font-normal"> being requested</span></h3> 
            <div className="scopes flex flex-col">
                {this.state.response.application?.scopes.map((scope: string, index: number) => {
                    const scopeFormat = scope == "email" ? "Account Email": scope == "linked_services" ? "Linked Services": scope == "purchases" ? "Purchases": "";
                    
                    return (
                      <div className="flex flex-row shadow-md rounded-md bg-gray-200 w-11/12 py-2 px-3 my-2 transition duration-200 ease-in transform hover:scale-105 justify-between" key={index}>
                        <div className="text-gray-500 font-medium">{scopeFormat}</div>
                        <div className="bg-pastelGreen rounded-full w-6 h-6 text-gray-400 flex justify-center content-end">
                          <svg aria-hidden="false" className="icon-1Vf2He w-5 h-5 inline my-auto" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><polyline stroke="currentColor" stroke-width="2" points="3.5 9.5 7 13 15 5"></polyline><svg aria-hidden="false" class="icon-1Vf2He" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><polyline stroke="currentColor" stroke-width="2" points="3.5 9.5 7 13 15 5"></polyline></g><svg aria-hidden="false" class="icon-1Vf2He" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><polyline stroke="currentColor" stroke-width="2" points="3.5 9.5 7 13 15 5"></polyline></g></svg></svg></g><svg aria-hidden="false" class="icon-1Vf2He" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><polyline stroke="currentColor" stroke-width="2" points="3.5 9.5 7 13 15 5"></polyline></g></svg></svg>
                        </div>
                      </div>
                    );

                }) || <h1>Errror</h1>}
              </div>
            </div>
        );

        title = (
          <h3 className="text-xl text-gray-700 font-bold mb-2">{this.state.response?.application?.name || ""} <span className="text-lg text-gray-500 font-normal"> is requesting information from your account.</span></h3>       
        );
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
                <img className="object-cover w-full h-percent-110 absolute m-0 z--1 top-0 left-0" src="../authorizeBanner.png" />
                  <div className="flex-1 absolute top-0 text-white p-5">
                  <svg className="fill-current text-black dark:text-white h-12 w-12" xmlns="http://www.w3.org/2000/svg" width="512"
                           height="512" viewBox="0 0 512 512">
                          <path id="ED" className="cls-1"
                                d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                      </svg>
                  </div>  
                  <div className="flex-1 absolute bottom-0 text-white p-5">
                    <h3 className="text-2xl font-bold inline-block">{ this.state.response?.success ? "Authorize": "Error"}</h3>
                    <p className="text-white whitespace-no-wrap">Oauth</p>
                  </div>
                  <svg className="absolute animate h-full w-4/12 sm:w-2/12 right-0 inset-y-0 fill-current text-white" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                      <polygon points="0,0 100,100 100,0" />
                  </svg>
                </div>
                <div className="flex-1 p-6 sm:p-10 sm:py-12 sm:pb-6">
                  {title}    
                  <hr className="border-gray-300 w-11/12 mb-2"></hr>
                  {body}
                  <div className="flex flex-wrap items-center mb-2">
                    <div className="text-sm text-gray-500 pt-4 sm:p-0 flex flex-row">
                      <div className="mr-1">Logged in as {this.props.user.name || "null"}</div>
                      <Link href="/logout">
                        <a className="text-gray-700">Not you?</a>
                      </Link>
                    </div>
                  </div>
                  <hr className="border-gray-300 w-11/12 mb-3"></hr>
                  <div className="flex justify-between w-11/12">
                    <div className="sm:w-auto bg-indigo-500 text-indigo-100 px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none cursor-pointer transition duration-200 ease-in transform hover:scale-110 text-base font-medium">
                      Cancel
                    </div>
                    <div className="sm:w-auto bg-indigo-500 text-indigo-100 px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none cursor-pointer transition duration-200 ease-in transform hover:scale-110 text-base font-medium">
                      Authorize
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    //returning the view of the component because oauth2 request is valid
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
        <div className="flex flex-grow bg-gray-200 p-4 rotate"></div>
      </div>
    )
  }
}

//wrapping the exported value with private route to make sure user is authenticated
export default PrivateRoute(Authorization);