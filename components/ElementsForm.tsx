import React, { useState } from 'react';

import { fetchPostJSON } from '../utils/api-helpers';
import { formatAmountForDisplay } from '../utils/stripe-helpers';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_OPTIONS = {
  iconStyle: 'solid' as const,
  style: {
    base: {
      iconColor: '#6772e5',
      color: '#6772e5',
      fontWeight: '500',
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883'
      },
      '::placeholder': {
        color: '#6772e5'
      }
    },
    invalid: {
      iconColor: '#ef2961',
      color: '#ef2961'
    }
  }
};

const config = {
  CURRENCY: 'usd',
  // Set your amount limits: Use float for decimal currencies and
  // Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
  MIN_AMOUNT: 10.0,
  MAX_AMOUNT: 5000.0,
  AMOUNT_STEP: 5.0
}

const ElementsForm: React.FunctionComponent<{
  children?: React.ReactNode,
  pkg: string,
  super: React.Component
}> = (props) => {
  const [input, setInput] = useState({
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    cardholderName: ''
  });
  const [payment, setPayment] = useState({ status: 'initial' });
  const [errorMessage, setErrorMessage] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
        return <h2>Processing...</h2>;

      case 'requires_action':
        return <h2>Authenticating...</h2>;

      case 'succeeded':
        return <h2>Payment Succeeded 🥳</h2>;

      case 'error':
        return (
          <>
            <h2>Error 😭</h2>
            <p className="error-message">{errorMessage}</p>
          </>
        );

      default:
        return null;
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value
    });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();

    // props.super.setState({
    //   complet
    // });

    // Abort if form isn't valid
    if (!e.currentTarget.reportValidity()) return;
    
    props.super.setState({
      stripeError: null,
      stripePending: true,
      stripeStatus: "Payment Pending"
    });

    // Create a PaymentIntent with the specified amount.
    const response = await fetchPostJSON('/payments/v1/payment_intents', localStorage.getItem("token") || "", {
      pkg: props.pkg
    });

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements!.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentIntent } = await stripe!.confirmCardPayment(
      response.client_secret,
      {
        payment_method: {
          card: cardElement!,
          billing_details: { name: 'Jenny Rosen' }
        }
      }
    );

    if (error) {
      props.super.setState({
        stripePending: false,
        stripeError: error.message
      })
    }

    if (!paymentIntent) {
      return;
    }

    if (paymentIntent!.status !== "succeeded") {
      return;
    }

    props.super.setState({
      complete: true
    });
  };

  return (
    <>
      <form className="h-full" onSubmit={handleSubmit}>
          <CardElement
            onChange={e => {
              if (e.error) {
                setPayment({ status: 'error' });
                setErrorMessage(
                  e.error.message ?? 'An unknown error occured'
                );
              }
            }}
          />
        <button className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: "rgb(126, 138, 243)" }}>Purchase</button>
      </form>
    </>
  );
};

export default ElementsForm;