import express from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt'
import pg from "../db/pg";

const dev = process.env.NODE_ENV === "development";
const app = express();
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
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

    await pg('accounts').insert({ username: req.body.username, email: req.body.email, password: await bcrypt.hash(req.body.password1, 10)});

    return res.status(200).json({
      success: true
    })

  } catch(e) {
    console.log(e);
  }
})

export default app;