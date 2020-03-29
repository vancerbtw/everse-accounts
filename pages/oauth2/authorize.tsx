import React from "react";
import Link from 'next/link'
import { AppProps } from 'next/app'
import { NextPageContext } from 'next'
import host from '../../helpers/host'
import fetch from 'isomorphic-unfetch';
import { runInThisContext } from "vm";
import Nav from "../../components/Nav";
import { PrivateRoute } from "../../components/PrivateRoute";

interface AuthResponse {
  success: Boolean;
  error?: string;
  token?: string;
}

interface User {
  success: Boolean,
  name?: string,
  email?: string,
  verified?: Boolean,
  disabled?: Boolean
}

type AuthProps = {
  query: URLSearchParams,
  response: AuthResponse,
  user: User
};

class Authorization extends React.Component<AuthProps> {

  static async getInitialProps({ query }: NextPageContext) {
    if (!query.client_id || !query.redirect_uri || !query.scopes) return {query}

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
    console.log(query)
    return { query, response: await res.json() }
  }

  render() {
    console.log(this.props.query.get("redirect_uri"))
    if (!this.props.query.get("client_id") || !this.props.query.get("redirect_uri") || !this.props.query.get("scopes")) return <h1>Error, Missing Query Parameters</h1>
    if (this.props.response && !this.props.response.success) return <h1>{this.props.response.error || "Internal Error"}</h1>
    console.log(this.props.user)
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

export default PrivateRoute(Authorization);