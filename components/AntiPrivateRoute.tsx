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

export default function AntiPrivateRoute(WrappedComponent: any) {
  return class extends Component<PrivateProps> {
    state = {
      show: false
    };

    componentDidMount() {
      if (localStorage.getItem('token') == "" || localStorage.getItem('token') == undefined) {
        this.setState({
          show: true
        });
      } else {
        Router.push('/');
      }
    }

    render() {
      //lets render the component were wrapping with this privateRoute
      const {...propsWithoutAuth } = this.props;
      if (this.state.show) {
        return <WrappedComponent querys={new URLSearchParams(window.location.search)} {...propsWithoutAuth} />;
      } else {
        return <div></div>
      } 
    }
  };
}