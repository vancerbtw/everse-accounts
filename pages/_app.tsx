import React from "react";
import Head from "next/head";

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