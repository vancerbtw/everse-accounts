import Nav from "../components/Nav";
import Footer from "../components/Footer";
import React from "react";

const Home = () => (
    <main className={"h-screen flex flex-col"}>
        <Nav/>
        <div className="flex items-center justify-center px-6 flex-grow">
            <span className="font-medium text-6xl tracking-tight">Coming Soon</span>
        </div>
        <Footer/>
    </main>
);

export default Home
