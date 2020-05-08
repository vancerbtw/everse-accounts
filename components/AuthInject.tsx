import { NextPageContext } from "next";
import Router, { NextRouter } from 'next/router';
import React, { Component } from "react";
import {host} from '../helpers/host';

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

export default function AuthInject(WrappedComponent: any) {
  return class extends Component<PrivateProps> {
    state = {
      user: undefined,
      finished: false
    };

    componentDidMount() {
      fetch(`${host.self}/auth/token/verify`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}` || ""
          // 'Content-Type': 'application/x-www-form-urlencoded',
        } // body data type must match "Content-Type" header
      }).then(res => res.json()).then((data) => {
        if (data.success) {        
          this.setState({
            user: data
          });
        }

        this.setState({
          finished: true
        });
      });
    }

    render() {
      //lets render the component were wrapping with this privateRoute
      const {...propsWithoutAuth } = this.props;
      if (this.state.finished) {
        return <WrappedComponent user={this.state.user} querys={new URLSearchParams(window.location.search)} {...propsWithoutAuth} />;
      } 
      return <div></div>;
    }
  };
}