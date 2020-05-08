import React from "react";
import { PrivateRoute } from "../../components/PrivateRoute";
import { parse } from "path";
import { withRouter } from 'next/router'


type LinkProps = {

}

type LinkState = {
  error: string | undefined,
  newDevice: Boolean | undefined
}

class Link extends React.Component<LinkProps, LinkState> {
  constructor(props: LinkProps) {
    super(props);
    this.state = {
      newDevice: true,
      error: undefined
    };
  }

  async componentDidMount() {
    // const queries = new URLSearchParams(window.location.search)

    // if (!queries.get("token")) return this.setState({ error: "Missing 'Token' in query parameters." });
    // let verification;
    // try {
    //   verification = await (await fetch(`http://192.168.7.50:3004/device/verify`, {
    //   method: "post",
    //   body: JSON.stringify({ token: queries.get("token") }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': "Bearer " + localStorage.getItem("token")
    //   }
    // })).json();
    // } catch(e) {
    //   return this.setState({
    //     error: "Internal Server Error"
    //   });
    // }

    // if (!verification.success) {
    //   return this.setState({
    //     error: verification.error || ""
    //   });
    // }

    // if (!verification.exists) {
    //   return this.setState({
    //     newDevice: true
    //   });
    // }

    // if (!verification.linked) {
    //   return this.setState({
    //     error: "Device is linked with another user's account"
    //   });
    // }

    // let sessionResponse: { success: Boolean, error: string };

    // try {
    //   sessionResponse = await (await fetch(`http://192.168.7.50:3004/sessions/enable`, {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': "Bearer " + localStorage.getItem("token")
    //     },
    //     body: JSON.stringify({ device: parseInt(verification.device_id)}) // body data type must match "Content-Type" header
    //   })).json();
    // } catch {
    //   return this.setState({
    //     error: "Internal Server Error"
    //   });
    // }

    // if (sessionResponse.success) {
    //   window.location.href = queries.get("package") ? "cydia://package/" + queries.get("package"): "cydia://";
    // }

    // return this.setState({
    //   error: sessionResponse.error
    // });

    // // fetch(`http://192.168.7.50:3004/device/link`, {
    // //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // //   headers: {
    // //     'Content-Type': 'application/json',
    // //     'Authorization': "Bearer " + localStorage.getItem("token")
    // //   },
    // //   body: JSON.stringify({ token: new URLSearchParams(window.location.search).get("token")}) // body data type must match "Content-Type" header
    // // }).then((res) => res.json()).then((data: { device: string }) => {
      
    // // });
  }

  render() {
    if (this.state.error != undefined) {
      return (
        <div>{this.state.error}</div>
      );
    }

    if (this.state.newDevice === undefined) {
      return (
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
          <div className="flex flex-grow bg-gray-200 p-4 rotate"></div>
        </div>
      )
    }
    
    if (this.state.newDevice) {
      return (
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
          <div className="flex flex-grow bg-gray-200 p-4 rotate justify-center items-center h-auto">
            <div className="bg-gray-700 w-1/3 rounded-xl h-screen-45 flex flex-col justify-start items-center">
              <div className="w-11/12 justify-between mt-2 flex flex-grow flex-col"> 
                <div className="text-white text-3xl font-medium">Link Device</div>
                <div className="flex flex-grow h-auto flex-row">
                  <div className="flex-grow h-full">
                    <img src="../iPhoneX.png"></img>
                  </div>
                  <div className="flex-grow h-full">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default PrivateRoute(Link);

