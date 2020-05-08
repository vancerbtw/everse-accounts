import React from "react";
import { PrivateRoute } from "../components/PrivateRoute";
import QRCode from "qrcode.react";
import ReactMeasure from "react-measure";
import {IoMdImage} from "react-icons/io";
import {NextPageContext} from "next";

interface Props {
    profilePictureURL: string;
    authCode: string;
    user: {
        name: string,
        email: string,
        verified: Boolean,
        disabled: Boolean
    }
}

interface State {
    authValue: string,
    qrDimensions: {
        width: number,
        height: number
    },
    qrPoppedOut: boolean;
    picHover: boolean;
    profilePictureURL: string;
    username: string;
    email: string;
    authCode: string;
    origEmail: string;
    origUsername: string;
}

class View extends React.Component<Props, State> {
    state = {
        authValue: "",
        qrDimensions: {
            width: -1,
            height: -1,
        },
        qrPoppedOut: false,
        qrCode: Date.now(),
        picHover: false,
        profilePictureURL: "https://cdn.discordapp.com/avatars/458653079966056478/92215fda23b4f2ec324d3d5215e9ccb1.png?size=256",
        username: this.props.user.name,
        email: this.props.user.email,
        authCode: `Test. The date is ${new Date().toLocaleString()}.`,
        origEmail: this.props.user.email,
        origUsername: this.props.user.name
    };

    render() {
        const {profilePictureURL, username, email, authCode} = this.state;
        console.log(this.state.origEmail)
        console.log(this.state.email)
        const unsavedChanges = (this.state.origEmail !== this.state.email) || (this.state.origUsername !== this.state.username)
        return (
            <div className={"h-screen w-screen bg-light flex justify-center items-center"}>
                {
                    unsavedChanges && (
                        <div className="flex flex-col justify-end items-center absolute w-screen h-screen" style={{ pointerEvents: "none" }}>
                            <div id={"pwd"} className={"flex items-center w-1/2 bg-white shadow rounded-xl p-4 my-4"}>
                                <span className="text-sm font-semibold mr-auto">You have unsaved changes.</span>

                                <button className={"px-3 py-1 rounded-md bg-red-600 text-white text-sm font-medium text-center mx-2"}>DISCARD</button>
                                <button className={"px-3 py-1 rounded-md bg-blue-400 text-white text-sm font-medium text-center mx-2"}>SAVE</button>
                            </div>
                        </div>
                    )
                }
                <div className={"absolute lg:fixed left-0 top-0 m-4 flex flex-row justify-center items-center"}>
                    <svg className="fill-current h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg"
                         width="512"
                         height="512" viewBox="0 0 512 512">
                        <path id="ED" className="cls-1 text-dim"
                              d="M195.862,341.461H100.636V273.979h88.6V228.514h-88.6V171.057h95.226V125.592H45.148V387.283H195.862V341.461ZM432.136,159.422q-35.442-33.829-99.522-33.83H250.455V387.283h74.1q69.448,0,106.234-34.367t36.784-98.984Q467.577,193.253,432.136,159.422ZM329.75,341.461H305.944v-170.4h29.534q74.462,0,74.462,84.307,0,86.1-80.19,86.1h0Z"/>
                    </svg>
                    <span className="font-semibold text-sm tracking-tight text-dim">ACCOUNTS</span>
                </div>
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-12 my-20 mx-1/5"}>
                    <div className={"flex items-top justify-center lg:justify-end"}>
                        <div className={"flex flex-col items-center lg:sticky lg:top-20"} style={{
                            height: "min-content"
                        }}>
                            <div className={"relative"} 
                                    onMouseEnter={_ => this.setState({ picHover: true })}
                                    onMouseLeave={_ => this.setState({ picHover: false })}>
                                <img alt={"profile picture"}
                                     className={" overflow-hidden rounded-full max-w-64 max-h-64 shadow-2xl object-cover mb-2 transition-all duration-100 ease-in-out"}
                                     src={profilePictureURL} style={{ filter: this.state.picHover ? "blur(1rem)": ""}}/>
                                <div
                                    onClick={_ => alert("Update the profile picture, I guess.")}
                                    className={"cursor-pointer rounded-full absolute left-0 top-0 w-full flex items-center justify-center"}
                                    style={{
                                        height: "calc(100% - 0.5rem)",
                                        backgroundColor: "rgba(0, 0, 0, 0.2)"
                                    }}
                                >
                                    {
                                        this.state.picHover && ( 
                                            <IoMdImage className={"text-6xl text-white"}/>
                                        )
                                    }
                                </div>
                            </div>
                            <h1 className={"font-semibold text-center"}>{this.state.origUsername}</h1>
                            <small className={"text-dim"}>{this.state.origEmail}</small>
                        </div>
                    </div>
                    <div className={"flex flex-col"}>
                        <div id={"details"} className={"flex flex-col bg-white shadow-tiny rounded-xl p-6"}>
                            <h2 className={"text-lg font-semibold mb-3"}>Profile Details</h2>
                            <div className={"flex flex-col"}>
                                <div>
                                    <h3 className={"text-dim text-sm font-semibold ml-2 mb-2"}>USERNAME</h3>
                                    <input className={"w-full px-3 py-2 rounded-lg bg-light"} value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} type={"text"} placeholder="Username"/>
                                </div>
                                <div className={"mt-3"}>
                                    <h3 className={"text-dim text-sm font-semibold ml-2 mb-2"}>EMAIL</h3>
                                    <input className={"w-full px-3 py-2 rounded-lg bg-light"} type={"text"} value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} placeholder="Email"/>
                                </div>
                            </div>
                        </div>
                        <div id={"pwd"} className={"flex flex-col bg-white shadow rounded-xl p-6 my-4"}>
                            <h2 className={"text-lg font-semibold mb-2"}>Password & Two-Factor Authentication</h2>
                            <div className={"flex flex-col"}>
                                <div>
                                    <h3 className={"text-dim text-sm font-semibold ml-2"}>CURRENT PASSWORD</h3>
                                    <input className={"w-full px-3 py-2 rounded-lg bg-light"} type={"password"} placeholder={"••••••••••••••••••••••••••"}/>
                                    <div className={"text-dim text-xs ml-2 py-1"}>
                                        If you forgot your password, please log out and on the login page,
                                        use the Forgot Password link. It will allow you to reset your password.
                                    </div>
                                </div>
                                <div className={"mt-3"}>
                                    <h3 className={"text-dim text-sm font-semibold ml-2"}>NEW PASSWORD</h3>
                                    <input className={"w-full px-3 py-2 rounded-lg bg-light"} type={"password"} placeholder={"••••••••••••••••••••••••••"}/>
                                </div>
                                <div className={"mt-3"}>
                                    <h3 className={"text-dim text-sm font-semibold ml-2"}>CONFIRM NEW PASSWORD</h3>
                                    <input className={"w-full px-3 py-2 rounded-lg bg-light"} type={"password"} placeholder={"••••••••••••••••••••••••••"}/>
                                </div>
                                <div className={"mt-3"}>
                                    <h3 className={"text-dim text-sm font-semibold ml-2"}>TWO FACTOR AUTHENTICATION</h3>
                                    <div className={"mt-2 flex flex-col sm:flex-row justify-between items-center"}>
                                        <QRCode onClick={() => {
                                            this.setState(prevState => ({
                                                qrPoppedOut: !prevState.qrPoppedOut
                                            }));
                                        }} size={this.state.qrDimensions.height * (this.state.qrPoppedOut ? 2 : 1)}
                                                level={"H"}
                                                className={"transition-shadow duration-300 ease-out cursor-pointer " + (this.state.qrPoppedOut ?
                                                    "bg-white p-5 fixed rounded-xl shadow-2xl"
                                                    : "m-4 sm:ml-0 sm:my-0 sm:mr-4")}
                                                style={this.state.qrPoppedOut ? {
                                                    top: "50%",
                                                    left: "50%",
                                                    marginTop: -this.state.qrDimensions.height,
                                                    marginLeft: -this.state.qrDimensions.height
                                                } : {}}
                                                fgColor={"#000000"}
                                                renderAs={"svg"} bgColor={"transparent"} imageSettings={{
                                            excavate: true,
                                            height: this.state.qrDimensions.height * (this.state.qrPoppedOut ? 2 : 1) * 0.2,
                                            width: this.state.qrDimensions.height * (this.state.qrPoppedOut ? 2 : 1) * 0.3,
                                            src: "https://cdn.discordapp.com/attachments/691743634495766538/708290401345208360/Everse-Black-Cropped.png"
                                        }} value={authCode}/>
                                        <ReactMeasure bounds onResize={contentRect => {
                                            this.setState({
                                                qrDimensions: contentRect.bounds!
                                            })
                                        }}>
                                            {({measureRef}) => {
                                                return <div ref={measureRef} className={"flex flex-col w-full"}>
                                                    <h3 className={"font-normal"}>
                                                        Please scan this QR code using Google
                                                        Authenticator and enter
                                                        the code from the app below.</h3>
                                                    <div className={"flex flex-row items-center mt-2"}>
                                                        <input id={"2faInput"}
                                                               className={"px-3 py-2 rounded-l-lg bg-light text-center min-w-0 w-full"}
                                                               type={"string"} maxLength={6} placeholder={"123456"}
                                                               onChange={(e) => {
                                                                   if (!(/\D+/g.test(e.currentTarget.value)) && e.currentTarget.value.length <= 6) this.setState({
                                                                       authValue: e.currentTarget.value
                                                                   })
                                                               }}
                                                               value={this.state.authValue}
                                                        />
                                                        <button
                                                            className={"px-4 py-2 rounded-r-lg bg-blue-400 text-white text-center"}>SAVE
                                                        </button>
                                                    </div>
                                                </div>
                                            }}
                                        </ReactMeasure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PrivateRoute(View)