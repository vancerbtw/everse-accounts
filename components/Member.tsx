import React from "react";
import { FaDiscord, FaTwitter, FaRedditAlien } from "react-icons/fa";

interface MemberProps {
    image: string;
    username: string;
    discord?: string;
    twitter?: string;
    reddit?: string;
    customText?: string;
}

export default class Member extends React.Component<MemberProps> {
    render() {
        return (
            <div className={"mb-4 px-6 py-3 bg-triad dark:bg-gray-900 rounded-xl shadow-xl flex flex-col items-center"}>
                <img className={"h-16 w-16 rounded-full mb-2"} alt={`${this.props.username}'s avatar`} src={this.props.image}/>
                <h3 className={"font-semibold text-2xl"}>{this.props.username}</h3>
                <h6 className={"font-semibold text-sm text-gray-800 dark:text-gray-400 mb-3"}>{this.props.customText}</h6>
                <div className={"flex flex-row justify-around items-center"}>
                    {
                        this.props.discord ? (
                            <div className={"flex flex-col items-center justify-center"}>
                                <div className={"bg-dim rounded-full p-2 mb-1"}>
                                    <FaDiscord className={"text-xl text-discord"}/>
                                </div>
                                <span className={"ml-2 mr-2 text-xs font-thin"}>{this.props.discord}</span>
                            </div>
                        ) : null
                    }
                    {
                        this.props.twitter ? (
                            <div className={"flex flex-col items-center justify-center"}>
                                <div className={"bg-dim rounded-full p-2 mb-1"}>
                                    <FaTwitter className={"text-xl text-twitter"}/>
                                </div>
                                <span className={"text-xs font-thin"}>{this.props.twitter}</span>
                            </div>
                        ) : null
                    }
                    {
                        this.props.reddit ? (
                            <div className={"flex flex-col items-center justify-center"}>
                                <div className={"bg-dim rounded-full p-2 mb-1"}>
                                    <FaRedditAlien className={"text-xl"} style={{
                                        color: "#FF5700"
                                    }}/>
                                </div>
                                <span className={"ml-2 mr-2 text-xs font-thin"}>{this.props.reddit}</span>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        );
    };
};
