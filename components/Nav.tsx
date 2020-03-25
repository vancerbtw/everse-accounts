import React from "react"
import Router from "next/router"
import Link from "next/link"

class Nav extends React.Component {
  
  state = {
    expandHam: false,
     width: 0
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
      this.setState({ width: window.innerWidth});
  };
    
  render() {
    let links = (<div/>);
    if (this.state.width > 1024 || this.state.expandHam) {
      links = (
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 nav-link">
              Contact
            </a>
            <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 nav-link">
              Twitter
            </a>
            <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white nav-link" onClick={() => Router.push("https://discord.gg/wBjy7Gb")}>
              Discord
            </a>
          </div>
          <div>
            <Link href={"/s0n"}>
              <a className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Login</a>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <nav className="flex items-center justify-between flex-wrap p-6" style={{transition: "all 0.5s ease-out", backgroundColor: "#04A292"}}>
        <div className="flex items-center flex-shrink-0 text-white mr-6 logo" onClick={() => Router.push('/') }>

          <svg className="fill-current h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
            <defs>
              <style dangerouslySetInnerHTML={{__html: `
                .cls-1 {
                  fill: #fff;
                  fill-rule: evenodd;
                }
              `}} />
            </defs>
            <path id="ED" className="cls-1" d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
          </svg>
          <span className="font-medium text-xl tracking-tight">Everse Devs</span>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white" onClick={() => {
            this.setState({
              expandHam: !this.state.expandHam
            });
          }}>
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          {links}
        </div>
      </nav>
    );
  }
}

export default Nav;

