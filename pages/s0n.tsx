import Nav from "../components/Nav"
import '../styles/index.css'
import React from "react";

const Home = () => (
    <main>
        <Nav/>
        <div className="flex items-center justify-center flex-shrink-0 text-black mr-6 h-screen">
            <span className="font-medium text-6xl tracking-tight -my-100">Coming Soon</span>
        </div>
    </main>
);

export default Home
