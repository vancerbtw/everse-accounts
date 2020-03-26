import Nav from "../components/Nav";
import Member from "../components/Member";
import React from "react";

const Home = () => (
    <main className="flex flex-col h-full">
        <Nav/>
        <div className="items-center pt-16 flex flex-col overflow-x-scroll">
            <div className="flex flex-col w-4/5">
                <h1 className="text-4xl font-bold pb-3">Our Projects</h1>
                <div
                    className="rounded-xl px-6 py-2 header w-full mb-8 flex flex-col overflow-hidden shadow-xl transition duration-500 ease-in-out hover:scale-105 transform flex flex-col"
                    style={{
                        background: "linear-gradient(165deg,#f2801f,#d04032)"
                    }}>
                    <span className="text-4xl font-bold text-white">Jelbrek.icu</span>
                    <button
                        className="bg-gray-200 transition duration-500 ease-in-out hover:scale-110 transform text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center justify-between mt-1"
                        style={{borderRadius: "0.5rem", width: "10rem"}}
                        onClick={() => window.location.href = "https://jelbrek.icu"}>
                        <span>Available Now</span>
                        <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512"
                             height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/>
                        </svg>
                    </button>
                </div>
                <div
                    className="rounded-xl px-6 py-2 header w-full mb-8 shadow-xl transition duration-500 ease-in-out hover:scale-105 transform flex flex-col"
                    style={{
                        background: "linear-gradient(165deg,#487cdc,#1d4ca3)"
                    }}>
                    <span className="text-4xl font-bold text-white">Blaze Repo</span>
                    <span className="text-2xl font-medium text-white">Coming Soon</span>
                </div>
            </div>
            <div className="flex flex-wrap flex-col w-4/5 mb-8">
                <h1 className="text-4xl font-bold pb-3">Devlopers</h1>
                <div className={"flex flex-row flex-wrap justify-around items-center"}>
                    <Member image={"/neoney.png"} username={"neoney"} discord={"neoney#0847"} twitter={"@neoney_"} reddit={"u/neoney"} founder={true}/>
                    <Member image={"/raizo.png"} username={"raizo"} discord={"raizo#0001"} twitter={"@yvngraizo"} reddit={"u/iraizo"} founder={true}/>
                    <Member image={"/vance.jpg"} username={"VancerBTW"} discord={"VancerBTW#3505"} twitter={"@vancerbtw"} reddit={"u/vancerbtw"} founder={true}/>
                    <Member image={"/omegaDev.jpg"} username={"MegaDev"} discord={"coldhart#1337"} twitter={"@omegaluldev"} reddit={"u/ImAColdHart"} founder={false}/>
                </div>
            </div>
        </div>
    </main>
  );

export default Home
