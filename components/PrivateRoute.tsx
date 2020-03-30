import { NextPageContext } from "next";
import Router from 'next/router';
import React, { Component } from "react";
import host from '../helpers/host';

interface AuthResponse {
  success: Boolean,
  name?: string,
  email?: string,
  verified?: Boolean,
  disabled?: Boolean
}

interface AuthQuery {
  client_id?: string;
  redirect_uri?: string;
  scopes?: string;
}

type PrivateProps = {
  query: AuthQuery,
  response: AuthResponse,
  location: URLSearchParams
};

export function PrivateRoute(WrappedComponent: any) {
  return class extends Component<PrivateProps> {
    state = {
      user: undefined
    };

    componentDidMount() {
      fetch(`${host}/auth/token/verify`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}` || ""
          // 'Content-Type': 'application/x-www-form-urlencoded',
        } // body data type must match "Content-Type" header
      }).then(res => res.json()).then((data) => {
        if (!data.success) {
          localStorage.setItem("token", "");
          return Router.push(`/login?redirect=${encodeURIComponent(window.location.href)}`);
        }
        this.setState({
          user: data
        });
      });
    }

    render() {
      //lets render the component were wrapping with this privateRoute
      const {...propsWithoutAuth } = this.props;
      if (this.state.user) {
        return <WrappedComponent user={this.state.user} querys={new URLSearchParams(window.location.search)} {...propsWithoutAuth} />;
      }

      return <div></div>;
    }
  };
}