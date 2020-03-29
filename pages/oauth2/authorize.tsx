import React from "react";
import Link from 'next/link'
import { AppProps } from 'next/app'
import { NextPageContext } from 'next'
import host from '../../helpers/host';
import fetch from 'isomorphic-unfetch';
import { runInThisContext } from "vm";

interface AuthQuery {
  client_id?: string;
  redirect_uri?: string;
  scopes?: string;
}

interface AuthResponse {
  success: Boolean;
  error?: string;
  token?: string;
}

type AuthProps = {
  query: AuthQuery,
  response: AuthResponse,

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
    
    return { query, response: await res.json() }
  }

  render() {
    if (!this.props.query.client_id || !this.props.query.redirect_uri || !this.props.query.scopes) return <h1>Error, Missing Query Parameters</h1>
    if (!this.props.response.success) return <h1>{this.props.response.error || "Internal Error"}</h1>
    return <h1>{this.props.response.token}</h1>
  }
}

export default Authorization;