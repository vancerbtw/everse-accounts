import React from "react";
import {host} from '../../../helpers/host';
import fetch from 'isomorphic-unfetch';
import { PrivateRoute } from "../../../components/PrivateRoute"; //importing PrivateRoute to wrap our component export so it will require authentication
import ElementsForm from "../../../components/ElementsForm";
import StripeElement from "../../../components/StripeElement";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from "next/router";
import { NextRouter } from "next/router"

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

interface AuthorizeResponse {
  success: Boolean;
  error?: string;
  invalidate?: Boolean;
  token?: string;
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
  user: User,
  router: NextRouter
};

type AuthState = {
  response?: AuthResponse,
  error?: string,
  success?: Boolean,
  tab: number,
  package: string,
  stripeStatus: string,
  stripePending: Boolean,
  stripeError: string | null,
  complete: Boolean,
  step: number
}


class Purchase extends React.Component<AuthProps, AuthState> {
  constructor(props: any) {
    super(props);

    this.state = {
      response: undefined,
      error: undefined,
      success: undefined,
      tab: 1,
      package: this.props.router.query.pkg as string,
      stripeStatus: "",
      stripePending: false,
      stripeError: null,
      complete: false,
      step: 1
    }; 
  }

  async componentDidMount() {
    let response = await (await fetch("/payments/purchase/check", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ 
        item: this.state.package
      })
    })).json();

    if (!response.success) {
      return this.setState({
        error: response.error || ""
      });
    }

    return this.setState({
      success: true
    })
  }
  
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col h-screen">
            <div className="absolute flex items-center justify-between flex-wrap p-6 h-24 w-full bg-gray-200">
                <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>
                    <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                          height="512" viewBox="0 0 512 512">
                        <path id="ED" className="cls-1"
                              d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                    </svg>
                    <span className="font-medium text-xl tracking-tight">Payments</span>
                </div>
            </div>
            <div className="flex flex-grow bg-gray-200 p-4 rotate">
            <div className="mx-auto sm:max-w-xl md:max-w-2xl w-full m-auto">
                <div className="transition duration-400 ease-in-out flex flex-col items-stretch bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500 sm:flex-row sm:border-0 sm:h-screen-33">
                  <div className="flex justify-center mr-1 w-full">
                    <div className="self-center text-2xl text-gray-600">{this.state.error}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
    }

    if (this.state.success) {
      return (
        <div className="flex flex-col h-screen">
          <div className="absolute flex items-center justify-between flex-wrap p-6 h-24 w-full bg-gray-200">
              <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>
                  <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                        height="512" viewBox="0 0 512 512">
                      <path id="ED" className="cls-1"
                            d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                  </svg>
                  <span className="font-medium text-xl tracking-tight">Payments</span>
              </div>
          </div>
          <div className="flex flex-grow bg-gray-200 p-4 rotate">
          <div className="mx-auto sm:max-w-xl md:max-w-2xl w-full m-auto">
              <div className="transition duration-400 ease-in-out flex flex-col items-stretch bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500 sm:flex-row sm:border-0 sm:h-screen-33">
                <div className="relative z-30 bg-white flex flex-col flex-grow h-full overflow-x-hidden">
                  <div className="flex flex-col m-4 ml-6 mb-0 flex-grow">
                    <span className="text-gray-700 text-3xl font-semibold inline whitespace-no-wrap pr-1">Order <span className="text-gray-600 font-normal text-3xl">Details</span></span>          
                    <div className="flex mt-2 p-4 pb-2 rounded-lg overflow-x-hidden bg-gray-300" >
                      <img className="w-3/12 h-auto object-scale-down" style={{ maxWidth: "4rem" }} src="https://repo-cdn.dynastic.co/298385889657094145.4dfb36e5513666e66e713c185efa7863-332" alt="TweakIcon"></img>
                      <div className="flex flex-col ml-2">
                        <div className="text-3xl font-semibold align-text-top" style={{
                          position: "relative",
                          top: "-.25rem"
                        }}>Compactor</div>
                        <div className="text-lg font-medium align-text-top text-gray-600" style={{
                          position: "relative",
                          top: "-.65rem"
                        }}>Jamie Bishop</div>
                      </div>
                    </div>
  
                    <div className="w-full rounded-lg h-16 mt-4 flex bg-gray-300">
                      <div className=" w-12 h-12 mt-2 ml-2 flex justify-center rounded-md flex bg-gray-400">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-gray-500 self-center text-xl" />
                      </div>
  
                      <div style={{color: "rgb(92, 184, 92)"}} className="text-3xl font-semibold self-center ml-4">US$1.49</div>
                    </div>
                  </div>
                  <div className="h-8 mb-4 mx-6" style={{width: "calc(100% - 3rem)"}}>
                  <div className="text-sm text-gray-500 pt-4 sm:p-0 flex flex-row"><div className="mr-1">Logged in as {this.props.user.name}</div><a className="text-gray-700" href="/logout">Not you?</a></div>
                  </div>
                </div>
                <div className={`w-1/12 h-full flex flex-center items-center`} style={{ width: "2%" }}>
                  <div className="bg-gray-700 rounded-full" style={{width: "1px", height: "90%", opacity: .35}}></div>
                </div>
                <div className={`mb-4 mt-4 h-auto w-1/2 text-center mr-4 hidden relative overflow-x-show sm:flex`}>
                  {
                    this.state.step === 1 && (
                      <div className={`w-full h-full flex-col flex`}>
                        <span className="text-gray-700 text-3xl font-semibold inline whitespace-no-wrap pr-1 text-left">Payment <span className="text-gray-600 font-normal text-3xl">Method</span></span>          

                        <div className={`flex flex-row cursor-pointer rounded-md bg-gray-300 w-full py-2 px-3 my-2 transition duration-200 ease-in hover:scale-105" justify-between`} onClick={() => {
                          this.setState({
                            step: 2,
                            tab: 1
                          });
                        }}>
                          <div className="text-gray-600 text-xl font-medium">Debit/Credit Card</div>
                          <FontAwesomeIcon icon={faArrowCircleRight} className="text-pastelGreen text-2xl my-auto" />
                        </div>

                        <div className={`flex flex-row cursor-pointer rounded-md bg-gray-300 w-full py-2 px-3 my-2 transition duration-200 ease-in hover:scale-105" justify-between`} onClick={() => {
                          this.setState({
                            step: 2,
                            tab: 2
                          });
                        }}>
                          <div className="text-gray-600 text-xl font-medium">Paypal</div>
                          <FontAwesomeIcon icon={faArrowCircleRight} className="text-pastelGreen text-2xl my-auto" />
                        </div>

                        <div className={`flex flex-row cursor-pointer rounded-md bg-gray-300 w-full py-2 px-3 my-2 transition duration-200 ease-in hover:scale-105" justify-between`} onClick={() => {
                          this.setState({
                            step: 2,
                            tab: 3
                          });
                        }}>
                          <div className="text-gray-600 text-xl font-medium">Crypto Currency</div>
                          <FontAwesomeIcon icon={faArrowCircleRight} className="text-pastelGreen text-2xl my-auto" />
                        </div>
                      </div>
                    )  
                  }
                  {
                    (this.state.step === 2 && this.state.tab === 1) && (
                      <div className={`w-full h-full flex-col flex`}>
                        <span className="w-full text-gray-700 text-3xl font-semibold inline whitespace-no-wrap pr-1 text-left">Confirm <span className="text-gray-600 font-normal text-3xl">Purchase</span></span>          

                        {
                          this.state.stripePending && (
                            <div className="w-full flex text-2xl">
                              <div className="spinner self-center" style={{ height: "1.5rem", width: "1.5rem" }}></div>
                              <div className="ml-2 font-medium text-gray-600">{this.state.stripeStatus}</div>
                            </div>
                          )
                        }

                        {
                          this.state.stripeError && (
                            <div className="w-full flex text-lg text-red-500 whitespace-no-wrap overflow-hidden">
                              <div className="ml-2 font-medium">{this.state.stripeError}</div>
                            </div>
                          )
                        }

                        <StripeElement>
                          <ElementsForm pkg={this.state.package} super={this} />
                        </StripeElement>
                      </div>
                    )  
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  <span className="font-medium text-xl tracking-tight">Payments</span>
              </div>
          </div>
          <div className="flex flex-grow bg-gray-200 p-4 rotate">
          <div className="mx-auto sm:max-w-xl md:max-w-2xl w-full m-auto">
              <div className="transition duration-400 ease-in-out flex flex-col items-stretch bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500 sm:flex-row sm:border-0 sm:h-screen-33">
                <div className="flex justify-center mr-1 w-full">
                  <div className="loader self-center" style={{
                    width: "6em",
                    height: "6em"
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}


const PurchaseWithRouter = (props: { querys: URLSearchParams, response: AuthResponse, user: User }) => {
  const router = useRouter()
  return <Purchase {...props} router={router} />
}

//wrapping the exported value with private route to make sure user is authenticated
export default PrivateRoute(PurchaseWithRouter);