import Router from 'next/router';
import Head from 'next/head';
import React from 'react';

class Home extends React.Component {
  componentDidMount() {
    localStorage.setItem("token", "");
    let redirect = '/'; window.location.href
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('redirect')) {
      redirect = queryParams.get('redirect') || "";
    }
    window.location.href = redirect
  }

  render() {
    return (
      <div className="flex flex-col h-screen bg-gray-200">
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
        </div>
      </div>
    );
  }
}

export default Home
