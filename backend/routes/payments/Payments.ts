import express, { response } from 'express';
import verify from "../../Helpers/Authentication";
import pg from '../../db/pg';
import jwt from 'jsonwebtoken';
import next from "next";
import { formatAmountForStripe } from '../../../utils/stripe-helpers'
import Stripe from 'stripe'

const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: "2020-03-02"
});

export const payments = express.Router();

interface Discount {
  developer: number;
  code: string;
  percentage: boolean;
  ammount: number;
  all: boolean;
  packages: string[];
  active: boolean;
}

payments.post('/v1/payment_intents', verify, async (req, res) => {
  let item = await pg("packages").select().where({ identifier: req.body.pkg, paid: true }).first();

  if (!item) return res.status(400).json({ success: false, error: "Invalid Item" });

  const purchase = await pg("purchases").where({ 'purchases.user_id': req.user?.id, 'purchases.purchase_item': item.id}).select().innerJoin("transactions", "purchases.id", "transactions.purchase_id").first();

  if (purchase != undefined) {
    if (purchase.complete) {
      //package has previously been successfully completed 
      return res.status(400).json({ success: false, error: "Purchase has already been made and completed on this account for this item" });
    }

    //purchase is already pending
    if (purchase.processor_id === "1") {
      //previous pending purchase is a stripe purchase
      await stripe.paymentIntents.cancel(purchase.transac_identifier);

      await pg("purchases").where({ user_id: req.user?.id, purchase_item: item.id}).delete();
      await pg("transactions").where({ transac_identifier: purchase.transac_identifier}).delete();
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(item.price, "usd"),
    currency: 'usd',
    payment_method_types: ['card'],
  });

  const purchaseId: string = await pg("purchases").insert({
    user_id: req.user?.id,
    purchase_item: item.id,
    developer_id: item.developer,
    processor_id: '1'
  }).returning("id");

  console.log(`purchase: ${purchaseId}`)

  await pg("transactions").insert({
    user_id: req.user?.id,
    purchase_id: parseInt(purchaseId),
    transac_identifier: paymentIntent.id,
    amount: paymentIntent.amount
  });

  return res.status(200).json({client_secret: paymentIntent.client_secret});
});

payments.post('/initialize/paypal', async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(400).json({
      "success": false,
      "error": "Missing Authorization Header"
    });
  }
  
  if (req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ").length !== 2) {
    return res.status(400).json({
      "success": false,
      "error": "Invalid Authorization Header Format"
    });
  }

  const token = req.headers.authorization.split(" ")[1]
  let user = undefined;

  try {
    const decoded: { user_id?: string } = jwt.verify(token, process.env.JWT_SECRET || "") as {  user_id?: string  }; 
    user = await pg("accounts").where({id: decoded.user_id || "" }).first();

    if (!user) {
      return res.status(400).json({
        "success": false,
        "error": "Invalid Token Body"
      });
    }
    
  } catch(e) {
    console.log(e);
    return res.status(400).json({
      "success": false,
      "error": "Error decoding token"
    });
  }

  const identifier = req.body.item;

  if (!req.body.processor || !identifier) {
    return res.status(400).json({
      "success": false,
      "error": "Invalid Request Body"
    });
  }

  const item = await pg("packages").select().where({ identifier: identifier }).first();

  if (!item) {
    return res.status(400).json({
      "success": false,
      "error": "Invalid Item on Request"
    });
  }

  let discount: Discount | undefined = undefined;

  if (req.body.discount) {
    discount = await pg<Discount>("discounts").select().where({ code: req.body.discount, developer: item.developer_id, active: true }).first();

    if (!discount) {
      return res.status(400).json({
        "success": false,
        "error": "Invalid Discount Code"
      });
    }

    if (!discount!.all) {
      if (!discount!.packages.includes(item.identifier)) {
        return res.status(400).json({
          "success": false,
          "error": "Invalid Discount Code"
        });
      }
    }
  }

  //interface with paypal API here

  

  //then you will have paypal payement url here
  return res.status(200).json({
    "success": true,
    "url": "https://placeholderURL.com/"
  });
});

payments.post("/purchase/check", verify, async (req, res) => {
  if (!req.body.item) return res.status(400).json({ success: false, error: "Item: 'item' is missing on Request Body" });
  let inventory = await pg("inventories").select().where({ user_id: req.user?.id }).first();

  if (!inventory) {
    return res.status(200).json({
      success: true
    });
  }

  let item = await pg("packages").select().where({ identifier: req.body.item, pending: false, active: true}).first();

  if (!item) {
    return res.status(400).json({ success: false, error: "Package does not exist or it is disabled." });
  }

  if (!item.paid) {
    return res.status(400).json({ success: false, error: "Package is not a paid package." });
  }

  if (inventory.items.includes(req.body.item)) {
    return res.status(400).json({ success: false, error: `User already owns: '${item.name}'` })
  }

  return res.status(200).json({ success: true });
});
