import React from "react";
import Link from 'next/link'
import { AppProps } from 'next/app'
import { NextPageContext } from 'next'
import host from '../../helpers/host'
import fetch from 'isomorphic-unfetch';
import { runInThisContext } from "vm";
import Nav from "../../components/Nav";
import { PrivateRoute } from "../../components/PrivateRoute"; //importing PrivateRoute to wrap our component export so it will require authentication

//the verification response of our api describing the Legitimacy of the oauth request
interface AuthResponse {
  success: Boolean;
  error?: string;
  token?: string;
}

// the user schema of user that is logged in
interface User {
  success: Boolean,
  name?: string,
  email?: string,
  verified?: Boolean,
  disabled?: Boolean
}

//props recieving in component
type AuthProps = {
  query: URLSearchParams,
  response: AuthResponse,
  user: User
};


class Authorization extends React.Component<AuthProps> {

  static async getInitialProps({ query }: NextPageContext) {
    if (!query.client_id || !query.redirect_uri || !query.scopes) return {query}

    //verifying with api that oauth request url is valid
    const res = await fetch(`${host}/api/oauth2/authorize/verify`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        client_id: query.client_id,
        redirect_uri: query.redirect_uri,
        scopes: (query.scopes as string).split(" ")
      }) // body data type must match "Content-Type" header
    });

    //returning our props for our component
    return { query, response: await res.json() }
  }

  render() {
    //making sure all valid query parameters are present in url of request
    if (!this.props.query.get("client_id") || !this.props.query.get("redirect_uri") || !this.props.query.get("scopes")) return <h1>Error, Missing Query Parameters</h1>
    
    //returning if the response is present and the success value of it is false because of error
    if (this.props.response && !this.props.response.success) return <h1>{this.props.response.error || "Internal Error"}</h1>

    //returning the view of the component because oauth2 request is valid
    return (
      <div className="flex flex-col h-screen w-screen bg-dark">
        <Nav />
        <div className="flex-grow w-full flex flex-col justify-content align-items">
          <h1 className="text-black dark:text-white">{this.props.user.name}</h1>
        </div>
      </div>
    )
  }
}

//wrapping the exported value with private route to make sure user is authenticated
export default PrivateRoute(Authorization);