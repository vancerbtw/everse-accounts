import React from "react";
import {host} from '../../../helpers/host';
import fetch from 'isomorphic-unfetch';
import { PrivateRoute } from "../../../components/PrivateRoute"; //importing PrivateRoute to wrap our component export so it will require authentication
import ElementsForm from "../../../components/ElementsForm";
import StripeElement from "../../../components/StripeElement";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
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
  success?: string,
  tab: number,
  package: string,
  stripeStatus: string,
  stripePending: Boolean,
  stripeError: string | null,
  complete: Boolean
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
      complete: false
    }; 
  }

  componentDidMount() {
    
  }
  
  render() {
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
                <span className="font-medium text-xl tracking-tight">Payments</span>
            </div>
        </div>
        <div className="flex flex-grow bg-gray-200 p-4 rotate">
        <div className="mx-auto sm:max-w-xl md:max-w-2xl w-full m-auto">
            <div className="transition duration-400 ease-in-out flex flex-col items-stretch bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500 sm:flex-row sm:border-0 sm:h-screen-33">
              <div className="flex flex-col flex-grow h-full overflow-x-hidden">
                <div className="flex flex-col m-4 ml-6 mb-0 flex-grow">
                  <span className="text-gray-700 text-3xl font-semibold inline whitespace-no-wrap pr-1">Order <span className="text-gray-600 font-normal text-3xl">Details</span></span>          
                  <div className="flex mt-2 p-4 pb-2 rounded-lg overflow-x-hidden" style={{
                    backgroundColor: "rgb(235, 235, 235)"
                  }}>
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

                  <div className="w-full rounded-lg h-16 mt-4 flex" style={{
                    backgroundColor: "rgb(235, 235, 235)"
                  }}>
                    <div className=" w-12 h-12 mt-2 ml-2 flex justify-center rounded-md" style={{
                    backgroundColor: "rgb(219, 219, 219)"
                  }}>
                      <FontAwesomeIcon icon={faShoppingCart} className="text-gray-500 self-center text-xl" />
                    </div>

                    <div style={{color: "rgb(92, 184, 92)"}} className="text-3xl font-semibold self-center ml-4">US$1.49</div>
                  </div>
                </div>
                <div className="h-8 mb-4 mx-6" style={{width: "calc(100% - 3rem)"}}>
                <div className="text-sm text-gray-500 pt-4 sm:p-0 flex flex-row"><div className="mr-1">Logged in as {this.props.user.name}</div><a className="text-gray-700" href="/logout">Not you?</a></div>
                </div>
              </div>
              <div className="w-1/12 h-full flex flex-center items-center" style={{ width: "2%" }}>
                <div className="bg-gray-700 rounded-full" style={{width: "1px", height: "90%", opacity: .35}}></div>
              </div>
              <div className={`sm:flex sm:flex-col w-auto mb-2 sm:mt-0 mt-2 sm:h-auto sm:w-1/2 text-center ${this.state.complete ? "h-48": "h-32"}`}>
                <div className={`flex justify-center w-full h-full flex-col transition duration-300 ease-in-out transform sm:translate-x-0 ${this.state.complete ? "sm:translate-y-50": "-translate-x-full sm:-translate-y-full"}`}>
                  <div className="text-3xl text-green-600 self-center" style={{opacity: .75}}>Congratulations! <br /> Your purchase was successful.</div>
                </div>
                <div className={`ml-2 sm:m-2 sm:m-0 flex flex-col transition duration-300 ease-in-out transition duration-300 ease-in-out transform -translate-y-full sm:translate-x-0 ${this.state.complete ? "translate-x-full sm:translate-y-full": "sm:-translate-y-50"}`}>
                  <ul className="flex mt-0 sm:mt-4 sm:mb-5">
                    <li className="flex-1 mr-2">
                    <a className={`text-center block border cursor-pointer border-white rounded-md hover:border-gray-200 py-2 px-4 ${this.state.tab === 1 ? "text-white" : "text-blue-500"}`} onClick={() => {
                        this.setState({
                          tab: 1
                        });
                      }} style={{ backgroundColor: this.state.tab === 1 ? "rgb(126, 138, 243)" : "rgb(255, 255, 255)"}}>Stripe</a>
                    </li>
                    <li className="flex-1 mr-2">
                      <a className={`text-center block border cursor-pointer border-white rounded-md hover:border-gray-200 py-2 px-4 ${this.state.tab === 2 ? "text-white" : "text-blue-500"}`} onClick={() => {
                        this.setState({
                          tab: 2
                        });
                      }} style={{ backgroundColor: this.state.tab === 2 ? "rgb(126, 138, 243)" : "rgb(255, 255, 255)"}}>PayPal</a>
                    </li>
                  </ul>   
                  {
                    this.state.tab === 1 ? (
                      <div className="w-full" style={{ height: "50%"}}>
                        <div className="flex-row hidden sm:flex">
                          <div className="text-xl sm:text-2xl font-semibold">Pay with</div>
                          <img className="ml-2 mt-1 h-6 sm:h-8 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1280px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe"/>
                        </div>
                        {
                          (this.state.stripePending && !this.state.stripeError) && (
                            <div className="flex">
                              <div className="flex justify-center mr-1">
                                <div className="spinner self-center" style={{
                                  width: "1rem",
                                  height: "1rem"
                                }}></div>
                              </div>
                              <div className=" text-gray-600 text-xl font-medium">{this.state.stripeStatus}</div>
                            </div>
                          )
                        }
                        {
                          this.state.stripeError && (
                            <div className="text-red-600" style={{ opacity: 0.75}}>
                              {this.state.stripeError}
                            </div>
                          )
                        }
                        <StripeElement>
                          <ElementsForm pkg={this.state.package} super={this} />
                        </StripeElement>
                      </div>
                    ): (
                      <div className="w-full" style={{ height: "50%", marginTop: "10%"  }}>
                        <div className="flex flex-row">
                          <div className="text-2xl font-semibold">Pay with</div>
                          <img className="ml-2 mt-1 h-8 w-auto" style={{ transform: "translateY(.1rem)" }} src="https://www.urbantool.com/wp-content/uploads/2016/12/paypal-logo-png.png" alt="Paypal"/>
                        </div>
                        <button className="px-4 py-2 rounded-md text-white mt-2" style={{ backgroundColor: "rgb(126, 138, 243)" }}>Purchase</button>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


const PurchaseWithRouter = (props: { querys: URLSearchParams, response: AuthResponse, user: User }) => {
  const router = useRouter()
  return <Purchase {...props} router={router} />
}

//wrapping the exported value with private route to make sure user is authenticated
export default PrivateRoute(PurchaseWithRouter);