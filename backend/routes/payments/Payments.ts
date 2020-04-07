import express, { response } from 'express';
import pg from '../../db/pg';
import jwt from 'jsonwebtoken';

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

