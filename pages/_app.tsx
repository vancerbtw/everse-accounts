import React from "react";
import Head from "next/head";
import "../styles/index.css";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Everse Development</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp
