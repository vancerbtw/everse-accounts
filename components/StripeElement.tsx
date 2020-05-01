import React from 'react';
import Head from 'next/head';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

type Props = {
  title?: string;
};

const stripePromise = loadStripe("pk_test_QGWdqKVF871Pq54MtPolpCt8");

const Stripe: React.FunctionComponent<Props> = ({
  children,
  title = 'TypeScript Next.js Stripe Example'
}) => (
  <Elements stripe={stripePromise}>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@thorwebdev" />
      <meta name="twitter:title" content="TypeScript Next.js Stripe Example" />
      <meta
        name="twitter:description"
        content="Full-stack TypeScript example using Next.js, react-stripe-js, and stripe-node."
      />
      <meta
        name="twitter:image"
        content="https://nextjs-typescript-react-stripe-js.now.sh/social_card.png"
      />
    </Head>
    <div className="container">
      {children}
    </div>
  </Elements>
);

export default Stripe;
