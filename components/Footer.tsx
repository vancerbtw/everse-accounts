import React from "react";
import {FaDiscord, FaTwitter} from "react-icons/fa";
import Link from "next/link";

export default class Footer extends React.Component {
    render() {
        return (
            <div
                className={"flex flex-stretch flex-col items-center justify-center py-8 px-6 text-gray-300 dark:text-gray-900"}>
                <div className={"flex flex-row items-center justify-center text-3xl mb-2"}>
                    <Link href={"https://discord.gg/Bdnc4dq"} prefetch={false}>
                        <a>
                            <FaDiscord
                                className="mr-4 transition-colors ease-in-out duration-300 hover:text-discord"/>
                        </a>
                    </Link>
                    <Link href={"https://twitter.com/eversedev"} prefetch={false}>
                        <a>
                            <FaTwitter
                                className="ml-4 transition-colors ease-in-out duration-300 hover:text-twitter"/>
                        </a>
                    </Link>
                </div>
                <h5 className={"font-bold transition-colors ease-in-out duration-300 hover:text-gray-400"}>By Everse
                    Development</h5>
            </div>
        )
    };
}