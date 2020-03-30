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
      console.log(data)
      if (!data.success) {
        this.setState({
          error: data.error || "Invalid Authentication Request"
        });
        return;
      }

      this.setState({
        response: data
      });
    });
  }

  render() {
    //making sure all valid query parameters are present in url of request
    if (!this.props.querys.get("client_id") || !this.props.querys.get("redirect_uri") || !this.props.querys.get("scopes")) return <h1>Error, Missing Query Parameters</h1>
    
    //returning if the response is present and the success value of it is false because of error
    let mainView;

    if (this.state.response) {
      mainView = (
        <div className="w-full h-screen-45 flex flex-col items-center">
          <div className="text-white text-center inline-flex text-3xl font-semibold">{this.state.response.application?.name || ""}</div>
          <div className="flex-grow w-full flex flex-col items-center">
            <div className="text-white">User: {this.props.user.name || ""} <Link href="/"><a className="text-brand">Not You?</a></Link></div>
            <hr className="w-5/6 opacity-75 my-2 mb-1"></hr>
            <div className="text-white text-2xl px-6">Permissions</div>
            <table className="text-left m-4">
              <tbody >
                  <tr className="hover:bg-blue-lightest">
                      <td className="py-1 px-6 border-b border-grey-light text-white font-medium">Email</td>
                      <td className="py-1 px-6 border-b border-grey-light text-center">{this.state.response.application?.scopes.includes("email") ? "✅" : "❌" || "❌"}</td>
                  </tr>
                  <tr className="hover:bg-blue-lightest">
                      <td className="py-4 px-6 border-b border-grey-light text-white font-medium">Purchases</td>
                      <td className="py-4 px-6 border-b border-grey-light text-center">{this.state.response.application?.scopes.includes("purchases") ? "✅" : "❌" || "❌"}</td>
                  </tr>
                  <tr className="hover:bg-blue-lightest">
                      <td className="py-4 px-6 border-b border-grey-light text-white font-medium">Linked Services</td>
                      <td className="py-4 px-6 border-b border-grey-light text-center">{this.state.response.application?.scopes.includes("linked_services") ? "✅" : "❌" || "❌"}</td>
                  </tr>
              </tbody>
            </table>
            <div className="flex justify-between flex-row w-4/5 mt-5">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Authorize
            </button>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.error) {
      mainView = (
        <div>
          <div className="text-white">{this.state.error}</div>
        </div>
      );
    }
    //returning the view of the component because oauth2 request is valid
    return (
      <div className="block">
        <div className="flex flex-col h-screen w-screen bg-dark">
          <Nav />
          <div className="flex flex-col justify-center items-center flex-grow">
            <div className="w-2/5 h-screen-45 rounded-lg bg-discord flex flex-row justify-center items-center">
              {mainView}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

//wrapping the exported value with private route to make sure user is authenticated
export default PrivateRoute(Authorization);