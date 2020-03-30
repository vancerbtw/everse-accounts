import express from 'express';
import pg from '../../db/pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { read } from 'fs';

export const localAuth = express.Router();

localAuth.post('/register', async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password1 || !req.body.password2) return res.status(400).json({
      success: false,
      error: "Request is missing parameter"
    });
  
    if (req.body.password1 != req.body.password2) return res.status(400).json({
      success: false,
      error: "Passwords do not match"
    });
  
    try {
  
      let users = await pg("accounts").select().where({'email': req.body.email });
  
      if (users.length > 0) return res.status(400).json({
        success: false,
        error: "User is already registered with email"
      });
  
      const id = await pg('accounts').insert({ username: req.body.username, email: req.body.email, password: await argon2.hash(req.body.password1)}).returning('id');
  
      return res.status(200).json({
        success: true,
        token: jwt.sign({ 
          user_id: id
        }, process.env.JWT_SECRET)
      });
  
    } catch(e) {
      console.log(e);
    }
});

localAuth.post("/login", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    //Missing scopes
    return res.status(400).json({
      "success": false,
      "error": "Missing: Email"
    });
  }

  const password = req.body.password;
  if (!password) {
    //Missing scopes
    return res.status(400).json({
      "success": false,
      "error": "Missing: Password"
    });
  }

  const users = await pg("accounts").where({email: email });
  if (users.length <= 0) {
    return res.status(400).json({
      "success": false,
      "error": "Invalid email"
    });
  }

  const user = users[0];
  
  try {
    if (await argon2.verify(user.password, password)) {
      // password match
      return res.status(200).json({
        "success": true,
        "token": jwt.sign({ 
          user_id: user.id
        }, process.env.JWT_SECRET)
      });
    } else {
      //passwords do not match
      return res.status(400).json({
        "success": false,
        "error": "Passwords do not match"
      });
    }
  } catch (err) {
    // internal failure
    return res.status(400).json({
      "success": false,
      "error": "Internal error"
    });
  }
});

localAuth.post('/token/verify', async (req, res) => {
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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const users = await pg("accounts").where({id: decoded.user_id });
    if (!users[0]) {
      return res.status(400).json({
        "success": false,
        "error": "Invalid Token Body"
      });
    }
    const user = users[0];
    return res.status(200).json({
      success: true,
      name: user.username,
      email: user.email,
      verified: user.verified,
      disabled: user.disabled
    })
  } catch(e) {
    console.log(e);
    return res.status(400).json({
      "success": false,
      "error": "Error decoding token"
    });
  }
});