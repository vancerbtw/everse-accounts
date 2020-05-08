import React from "react";
import AuthInject from "../../components/AuthInject";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { faEye, faCamera } from '@fortawesome/free-solid-svg-icons'
import { NextRouter, useRouter } from "next/router";
import RouterInject from "../../components/RouterInject";
import PortfolioRenderer, { PortfolioModule } from "../../components/portfolio/PortfolioRenderer";

interface PortfolioProps {
  router: NextRouter,
  user: {
    id?: number,
    name?: string,
    email?: string,
    verified?: Boolean,
    disabled?: Boolean
  }
}

interface PortfolioState {
  error: string | undefined,
  editMode: Boolean,
  profileHover: Boolean,
  developer: {
    id: number,
    name: string,
    email: string,
    icon: string
  } | undefined,
  pageData: {
    modules: PortfolioModule[]
  } | undefined,
  isDeveloper: Boolean
}

class PortfolioWithoutRouter extends React.Component<PortfolioProps, PortfolioState> {
  constructor(props: PortfolioProps) {
    super(props);

    this.state = {
      error: undefined,
      editMode: true,
      profileHover: false,
      developer: undefined,
      isDeveloper: false,
      pageData: undefined
    };

    this.updateState = this.updateState.bind(this);
  }

  updateState(content: any) {
    this.setState(content);
  }

  async componentDidMount() {
    let developerRes = await (await fetch("/developer/info/profile", {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ dev: this.props.router.query.developer || ""})
    })).json();

    if (!developerRes.success) {
      return this.setState({
        error: developerRes.error || ""
      });
    }

    try {
      this.setState({
        pageData: JSON.parse(developerRes.pageBody)
      });
    } catch {
      this.setState({
        pageData: {
          modules: [
            {
              type: "socials",
              socials: [
                {
                  type: "github",
                  display: "supremevance",
                  link: "https://github.com/supremevance"
                },
                {
                  type: "twitter",
                  display: "supremevance",
                  link: "https://github.com/supremevance"
                }
              ]
            }
          ]
        }
      });
    }

    this.setState({
      developer: {
        id: developerRes.id,
        name: developerRes.name,
        email: developerRes.email,
        icon: developerRes.icon,
      },
      isDeveloper: developerRes.id === this.props.user.id
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="w-screen h-screen bg-gray-200 flex flex-col">
          <div className="flex items-center justify-between flex-wrap p-6 w-full">
              <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>
                  <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                        height="512" viewBox="0 0 512 512">
                      <path id="ED" className="cls-1"
                            d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                  </svg>
                  <span className="font-medium text-xl tracking-tight">Portfolio</span>
              </div>
              <FontAwesomeIcon icon={this.state.editMode ? faEye: faEdit } onClick={() => {
                this.setState({
                  editMode: !this.state.editMode
                });
              }} className="text-2xl text-gray-600 transform transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer" />
          </div>
          <div className="flex justify-center items-center flex-grow w-full">
            <div className=" text-gray-700 text-6xl">{this.state.error}</div>
          </div>
        </div>
      );
    }

    if (!this.state.developer) {
      return (
        <div className="w-screen h-screen bg-gray-200 flex flex-col">
          <div className="flex items-center justify-between flex-wrap p-6 w-full">
              <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>
                  <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                        height="512" viewBox="0 0 512 512">
                      <path id="ED" className="cls-1"
                            d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                  </svg>
                  <span className="font-medium text-xl tracking-tight">Portfolio</span>
              </div>
          </div>
          <div className="flex justify-center items-center flex-grow w-full">
            <div className="spinner text-6xl w-40 h-40 align-middle" style={{
              fontSize: "10rem"
            }}></div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-screen h-screen bg-gray-200 flex flex-col">
        <div className="flex items-center justify-between flex-wrap p-6 w-full">
            <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>
                <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                      height="512" viewBox="0 0 512 512">
                    <path id="ED" className="cls-1"
                          d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                </svg>
                <span className="font-medium text-xl tracking-tight">Portfolio</span>
            </div>
            {
              this.state.isDeveloper && (
                <FontAwesomeIcon icon={this.state.editMode ? faEye: faEdit } onClick={() => {
                  this.setState({
                    editMode: !this.state.editMode
                  });
                }} className="text-2xl text-gray-600 transform transition-all duration-200 ease-in-out hover:scale-110 cursor-pointer" />    
              )
            }
          </div>
        <div className="flex flex-col items-center flex-grow w-full mt-20">
          <div className="w-48 h-48 rounded-full overflow-hidden relative cursor-pointer" onMouseEnter={() => {
            if (!this.state.isDeveloper) return;
            this.setState({ profileHover: true });
          }} onMouseLeave={() => {
            if (!this.state.isDeveloper) return;
            this.setState({ profileHover: false });
          }} onClick={() => {
            if (!this.state.isDeveloper) return;
            (this.refs.fileUploader as HTMLElement).click();
          }}>
            {
              this.state.profileHover && (
                <div className="flex justify-center items-center absolute w-full h-full z-10">
                  <FontAwesomeIcon className="text-6xl text-white" icon={faCamera} />
                </div>
              )
            }
            <img src={this.state.developer.icon || "https://www.ekcreditunion.co.uk/wp-content/uploads/2018/02/Blank-Silhouette.jpg"} style={{ filter: this.state.profileHover ? "blur(1rem)": "" }} />
          </div>
          <span className="mt-5 text-2xl font-semibold text-gray-700">{this.state.developer.name}</span>
          <span className="text-sm text-gray-600">{this.state.developer.email}</span>
          <PortfolioRenderer updateState={this.updateState} portfolioData={this.state.pageData!} editing={this.state.editMode}/>
        </div>
        <input type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
      </div>
    );
  }
}

const Portfolio = (props: any) => {
  const router = useRouter();
  return <PortfolioWithoutRouter {...props} router={router} />
}

export default AuthInject(Portfolio);