import express, { response } from 'express';
import pg from '../../db/pg';
import jwt from 'jsonwebtoken';
import next from "next";
import Stripe from 'stripe'
import bodyParser from "body-parser";

const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: "2020-03-02"
});

export const stripeRoute = express.Router().use(bodyParser.raw({type: '*/*'}));

interface Discount {
  developer: number;
  code: string;
  percentage: boolean;
  ammount: number;
  all: boolean;
  packages: string[];
  active: boolean;
}

stripeRoute.post('/v1/callback', async (req, res) => {
  //now we check what stripe is telling us (the type of event) 
  let event = null;

  try {
    event = stripe.webhooks.constructEvent(req.body, req.get('stripe-signature') || "", "whsec_BiJM8voRGqifCMJPEP6TlMKcgaD20lu3");
  } catch (err) {
    console.log(err)
    // invalid signature
    return response.status(400).json({
      success: false,
      error: "Invalid Stripe Signature"
    });
  }

  let intent: {
    id: string
  } | null = null;
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        //successful payment notification
        intent = event.data.object as { id: string } | null

        const transaction = await pg("transactions").select().where({transac_identifier: intent?.id || ""}).first();

        if (!transaction) {
          return res.status(400).send("Error transaction missing in table for intent: " + intent?.id || "");
        }

        await pg("purchases").where({ id: transaction.purchase_id }).update({ complete: true });

        let purchase = await pg("purchases").select().where({ 'purchases.id': transaction.purchase_id }).innerJoin("packages", "purchases.purchase_item", "packages.id").first();

        if (!purchase) {
          return res.status(400).json({
            error: "Missing Purchase Object"
          });
        }

        let inventory = await pg("inventories").select().where({ user_id: transaction.user_id }).first();

        let items: string[] = inventory?.items || [];

        if (!inventory) {
          await pg("inventories").insert({
            user_id: transaction.user_id,
            items: "{}"
          });
        }

        items.push(purchase.identifier);

        await pg("inventories").where({
          user_id: transaction.user_id
        }).update({
          items: '{"' + items.join('","') + '"}' || ""
        });

        return res.status(200).end();

        break;

      case 'payment_intent.payment_failed':

        console.log("payment failed")

        return res.status(200).end();
    }
  } catch(e) {
    console.log(e)
  }
});