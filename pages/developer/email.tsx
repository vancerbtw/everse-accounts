import React from "react";
import fetch from 'isomorphic-unfetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib, faSearch, faMailBulk, faEnvelope, faPaperPlane, faWindowMinimize, faArrowUp, faTimes, faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons';
import { PrivateRoute } from "../../components/PrivateRoute"; //importing PrivateRoute to wrap our component export so it will require authentication
import MarkdownView from 'react-showdown';
import { CSSTransition } from "react-transition-group";
import TextEditor from "../../components/Email/TextEditor";
import EmailRender from "../../components/Email/EmailRender";

interface User {
  success: Boolean,
  name?: string,
  email?: string,
  verified?: Boolean,
  disabled?: Boolean,
  developer?: Boolean,
  icon: string | undefined
};

const datesAreOnSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

class Email extends React.Component {
  props: {
    user: User
  } = this.props;

  state: {
    error: string | undefined,
    inputSelect: boolean,
    search: string,
    tab: number,
    searching: boolean,
    emails: any[],
    composing: boolean,
    composingEmail: {
      to: string,
      subject: string,
      body: string
    } | undefined,
    emailMinimized: boolean,
    activeEmail: number | undefined
  } = { emailMinimized: false, error: undefined, inputSelect: false, search: "", tab: 1, searching: false, emails: [], composing: false, composingEmail: undefined, activeEmail: undefined };

  async componentDidMount() {
    if (!this.props.user.developer) {
      return this.setState({ error: "User is not a developer"});
    }

    this.setState({ searching: true });
    await this.getMail("inbox");
  }

  async getMail(type: string) {
    let res = await (await fetch(`/email/v1/get/${type}`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}` || ""
      }
    })).json();

    if (!res.success) return this.setState({ error: res.error || "Internal Server Error" })

    this.setState({
      emails: res.emails,
      searching: false
    })
  }
  
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col h-screen">
          <div className="absolute flex items-center justify-between flex-wrap p-6 h-24 w-full bg-gray-300">
              <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>
                  <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                        height="512" viewBox="0 0 512 512">
                      <path id="ED" className="cls-1"
                            d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                  </svg>
                  <span className="font-medium text-xl tracking-tight">Mail</span>
              </div>
          </div>
          <div className="flex flex-grow bg-gray-300 p-4 rotate">
          <div className="mx-auto sm:w-10/12 w-full m-auto">
              <div className="transition duration-400 ease-in-out flex flex-col items-stretch bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500 sm:flex-row sm:border-0 sm:h-screen-75">
                <div className="flex w-full justify-center">
                  <div className="self-center text-2xl font-semibold text-gray-700">{this.state.error}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-screen">
        <div className="absolute flex items-center justify-between flex-wrap p-6 h-24 w-full bg-gray-300">
            <div className="flex items-center flex-shrink-0 text-black mr-6 cursor-pointer dark:text-gray-600" onClick={() => window.location.href = "https://accounts.everse.dev"}>
                <svg className="fill-current text-black dark:text-gray-600 h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" width="512"
                      height="512" viewBox="0 0 512 512">
                    <path id="ED" className="cls-1"
                          d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                </svg>
                <span className="font-medium text-xl tracking-tight">Mail</span>
            </div>
        </div>
        <div className="flex flex-grow bg-gray-300 p-4 rotate">
        <div className="mx-auto sm:w-10/12 w-full m-auto">
            <div className="transition duration-400 ease-in-out flex flex-col items-stretch bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-indigo-500 sm:flex-row sm:border-0 sm:h-screen-75">
              <div className="flex w-full">
                <div className="sidebar-container w-2/12 h-full bg-gray-800 flex flex-col" style={{ minWidth: "16.666667%" }}>
                  <div className="sidebar-header w-full h-24 flex justify-center">
                    <div onClick={() => {
                      this.setState({
                        composing: !this.state.composing
                      });
                    }} className="transition duration-200 ease-in-out self-center flex flex-row rounded-full py-1 px-5 bg-gray-600 cursor-pointer transform hover:scale-105">
                      <FontAwesomeIcon icon={faPenNib} className="text-white self-center text-base" />
                      <div className="m-2 text-white text-base">New Message</div>
                    </div>  
                  </div> 
                  <div className="flex flex-col flex-grow">
                    <div onClick={async () => {
                      this.setState({
                        tab: 1,
                        searching: true,
                        activeEmail: undefined
                      });

                      await this.getMail("inbox");
                    }} className={`cursor-pointer flex justify-between max-w-full h-10 px-6 ${this.state.tab === 1 ? "shadow-2xl bg-gray-900 text-gray-200": "text-gray-400"}`}>
                      <FontAwesomeIcon icon={faEnvelope} className="self-center" />
                      <div className="self-center font-medium mr-auto ml-4">Inbox</div>
                    </div>
                    <div onClick={async () => {
                      this.setState({
                        tab: 2,
                        searching: true,
                        activeEmail: undefined
                      });

                      await this.getMail("star");
                    }} className={`cursor-pointer flex justify-between max-w-full h-10 px-6 ${this.state.tab === 2 ? "shadow-2xl bg-gray-900 text-gray-200": "text-gray-400"}`}>
                      <FontAwesomeIcon icon={fasFaStar} className="self-center text-md" />
                      <div className="self-center mr-auto ml-4">Starred</div>
                    </div>
                    <div onClick={async () => {
                      this.setState({
                        tab: 3,
                        searching: true,
                        activeEmail: undefined
                      });

                      await this.getMail("sent");
                    }} className={`cursor-pointer flex justify-between max-w-full h-10 px-6 ${this.state.tab === 3 ? "shadow-2xl bg-gray-900 text-gray-200": "text-gray-400"}`}>
                      <FontAwesomeIcon icon={faPaperPlane} className="self-center text-md" />
                      <div className="self-center mr-auto ml-4">Sent</div>
                    </div>
                    <div onClick={async () => {
                      this.setState({
                        tab: 4,
                        searching: true,
                        activeEmail: undefined
                      });

                      await this.getMail("all");
                    }} className={`cursor-pointer flex justify-between max-w-full h-10 px-6 ${this.state.tab === 4 ? "shadow-2xl bg-gray-900 text-gray-200": "text-gray-400"}`}>
                      <FontAwesomeIcon icon={faMailBulk} className="self-center text-md" />
                      <div className="self-center mr-auto ml-4">All Mail</div>
                    </div>
                  </div>                 
                </div>
                <div className="messages-container w-1/4 h-full bg-white flex flex-col" style={{ minWidth: "25%" }}>
                  <div className={`search w-full flex bg-white overflow-visible search-shadow `}>
                    {
                      !this.state.inputSelect && (
                        <FontAwesomeIcon icon={faSearch} className="text-white self-center text-2xl mx-2" style={{color: "#AAB7C4"}} />
                      )
                    }
                    <form onSubmit={async (e) => {
                      e.preventDefault();

                      if (this.state.search === "" || !this.state.search) return;

                      this.setState({
                        searching: true
                      });

                      let res = await (await fetch(`/email/v1/get/${this.state.tab === 1 ? "inbox": "" }/search/${this.state.search}`, {
                        method: "POST",
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem("token")}` || ""
                        }
                      })).json();
                  
                      if (!res.success) return this.setState({ error: res.error || "Internal Server Error" })
                  
                      this.setState({
                        emails: res.emails,
                        searching: false
                      })
                    }}>
                      <input onFocus={() => {
                        this.setState({
                          inputSelect: true
                        });
                      }} onBlur={() => {
                        this.setState({
                          inputSelect: false
                        });
                      }} onChange={(e) => {
                        this.setState({
                          search: e.target.value
                        });
                        if (e.target.value == "" || !e.target.value) this.getMail(this.state.tab === 1 ? "inbox": "")
                      }} placeholder="Search for email here" className="email-search font-sans m-0 flex-grow bg-transparent shadow-none text-black rounded-none font-medium"/>
                    </form>
                  </div>
                  { 
                    this.state.searching && (
                      <div className="email-spinner self-center my-auto" style={{ height: "6em", width: "6em" }}></div>
                    ) || (
                      <div className="messages-wrapper w-full h-full flex flex-col overflow-y-scroll">
                        {
                          this.state.emails.length <= 0 && (
                            <div className="w-full text-xl text-gray-600 font-semibold text-center">No Messages :(</div>
                          ) || (
                            <div>
                              {
                                this.state.emails.map((email, index) => {
                                  // const colors = [
                                  //   {
                                  //     bg: "f44336",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "E91E63",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "9C27B0",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "673AB7",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "3F51B5",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "2196F3",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "03A9F4",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "00BCD4",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "009688",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "4CAF50",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "FF9800",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "795548",
                                  //     fg: "ffffff"
                                  //   },
                                  //   {
                                  //     bg: "607D8B",
                                  //     fg: "ffffff"
                                  //   }
                                  // ];
                                  
                                  // let color = colors[Math.floor(Math.random() * colors.length)];

                                  const date = new Date(Date.parse(email.time));
                                  let time = `${((date.getHours() + 11) % 12 + 1)}:${(date.getMinutes()<10?'0':'') + date.getMinutes()} ${date.getHours() >= 12 ? "PM": "AM"}`;
                                  
                                  if (!datesAreOnSameDay(date, new Date())) {
                                    if (datesAreOnSameDay(date, new Date(new Date().setDate(new Date().getDate()-1)))) {
                                      time = "Yesterday";
                                    } else {
                                      time = `${date.toLocaleString('default', { month: 'short' })} ${date.getDay()}`;
                                    }
                                  }
                                  
                                  return ( 
                                    <div className={`border-t-2 cursor-pointer overflow-x-hidden p-4 flex w-full transition duration-200 ease-in-out ${this.state.activeEmail !== undefined ? this.state.activeEmail === index ? "bg-white border-transparent": this.state.activeEmail - 1 === index ? "message-unselected-top bg-gray-200 border-b-0 border-gray-300": this.state.activeEmail + 1 === index ? "message-unselected-bottom bg-gray-200 border-t-0 border-gray-300": "bg-gray-200 border-gray-300": "border-gray-300 hover:bg-gray-100 bg-gray-200"}`} style={{ minHeight: "6.5rem", maxHeight: "6.5rem" }} key={index} onClick={async () => {
                                      this.setState({
                                        activeEmail: index
                                      });

                                      email.read = true;

                                      await fetch(`/email/v1/read/${email.message_id}`, {
                                        method: "POST",
                                        headers: {
                                          'Authorization': `Bearer ${localStorage.getItem("token")}` || ""
                                        }
                                      });
                                    }}>
                                      <div className="left-message-collumn mr-2" style={{ minWidth: "3rem" }}>
                                        <img className="profile-picture h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${email.external_display}&background=2196F3&color=ffffff&bold=true`}></img>
                                      </div>
                                      <div className="right-message-collumn flex-grow flex flex-col">
                                        <div className="flex justify-between">
                                          <span className="text-xs" style={{color: "rgb(158, 158, 162)" }}>{email.external_display?.replace("+", " ") || ""} 
                                          { email.starred && (
                                            <FontAwesomeIcon className="text-xs w-2 ml-1 mr-auto self-center text-yellow-500" icon={fasFaStar} />
                                          )}</span>
                                          { !email.read && (
                                            <div className="bg-red-600 rounded-full h-2 w-2 ml-1 mr-auto self-center"></div>
                                          ) }
                                          <div className="text-xs" style={{color: "rgb(158, 158, 162)" }}>{time}</div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-700 overflow-hidden overflow-y truncate max-w-full">{email.subject || ""}</div>
                                        <div className="message-preview text-xs font-normal text-gray-600 h-10 overflow-hidden whitespace-pre-line">{email.body || ""}</div>
                                      </div>
                                    </div>
                                  );
                                })
                              }
                            </div>
                          )
                        }
                      </div>
                    )
                  }
                  
                </div>
                <div className="relative message-view-container flex-grow h-full bg-white overflow-hidden">
                  {
                    (this.state.composing && !this.state.emailMinimized) && (
                      <div className="absolute flex w-full h-full justify-center">
                        <div className="flex flex-col bg-gray-400 w-11/12 h-screen-50 self-end overflow-hidden" style={{ borderTopRightRadius: "0.75rem", borderTopLeftRadius: "0.75rem" }}>
                            <div className="bg-gray-600 h-8 w-full flex">
                              <div className="self-center text-sm text-gray-200 font-medium ml-2">New Message</div>
                              <div className="flex ml-auto mr-2 self-center">
                                <FontAwesomeIcon icon={faCompressAlt} className="text-gray-200 mr-2 cursor-pointer transform transition-all duration-200 ease-in-out hover:scale-110" onClick={() => { this.setState({ emailMinimized: true }); }}/>
                                <FontAwesomeIcon icon={faTimes} className="text-gray-200 cursor-pointer transform transition-all duration-200 ease-in-out hover:scale-110" onClick={() => { this.setState({ composingEmail: undefined, composing: false, emailMinimized: false }); }}/>
                              </div>
                            </div>
                            <input onChange={(e) => {
                              let email = this.state.composingEmail;
                              if (!email) email = { to: "", subject: "", body: e.target.value };

                              email.body = e.target.value;

                              this.setState({
                                composingEmail: email
                              });
                            }} style={{
                              maxWidth: "100%",
                              width: "calc(100% - 2rem)"
                            }} value={this.state.composingEmail?.subject || ""} className="self-center mt-4 mx-4 shadow-md rounded-md"/>
                            <TextEditor />
                        </div>
                      </div>
                    )
                  }
                  {
                    (this.state.composing && this.state.emailMinimized) && (
                      <div className="absolute flex w-full h-full justify-end">
                        <div className="flex flex-col bg-gray-400 w-2/5 h-8 self-end overflow-hidden" style={{ borderTopLeftRadius: "0.75rem" }}>
                            <div className="bg-gray-600 h-8 w-full flex">
                              <div className="self-center text-sm text-gray-200 font-medium ml-2">New Message</div>
                              <div className="flex ml-auto mr-2 self-center">
                                <FontAwesomeIcon icon={faExpandAlt} className="text-gray-200 mr-2 cursor-pointer transform transition-all duration-200 ease-in-out hover:scale-110" onClick={() => { this.setState({ emailMinimized: false }); }}/>
                                <FontAwesomeIcon icon={faTimes} className="text-gray-200 cursor-pointer transform transition-all duration-200 ease-in-out hover:scale-110" onClick={() => { this.setState({ composingEmail: undefined, composing: false, emailMinimized: false }); }}/>
                              </div>
                            </div>
                        </div>
                      </div>
                    )
                  }
                  {
                    this.state.activeEmail !== undefined && (
                      <EmailRender email={this.state.emails[this.state.activeEmail!]} super={this} index={this.state.activeEmail!} emails={this.state.emails} />
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PrivateRoute(Email);