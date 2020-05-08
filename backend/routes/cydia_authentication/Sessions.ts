import express from "express";
import jwt from "jsonwebtoken";
import verify from "../../Helpers/Authentication"
import { encrypt } from "../../Helpers/Pbkdf2";
import pg from "../../db/pg";

export const sessions = express.Router();

sessions.post("/enable", verify, async (req, res) => {
  if (!req.body.device) return res.status(400).json({ success: false, error: "Missing fields" });

  const session = await pg("sessions").select().where({ device_id: req.body.device}).first();

  if (session != undefined && session.user_id != req.user?.id) return res.status(400).json({ success: false, error: "Device is already logged in with another account" });
  
  let device;
  try {
    device = pg("devices").select().where({ device_id: req.body.device, user_id: req.user?.id}).first();
  } catch {
    return res.status(400).json({ success: false, error: "Internal Server Error" });
  }

  if (!device) return res.status(400).json({ success: false, error: "Invalid Device" });

  try {
    await pg("sessions").where({device_id: req.body.device, user_id: req.user?.id}).del();

    await pg("sessions").insert({device_id: req.body.device, user_id: req.user?.id});
  } catch(e) {
    console.log(e)
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  res.status(200).json({ success: true });
});

sessions.post("/disable", async (req, res) => {
  if (!req.body.token) return res.status(400).json({ success: false, error: "Missing fields" });
  
  let decoded: string | { udid: string, model: string };
  try {
    decoded = jwt.verify(req.body.token, process.env.JWT_SECRET || "") as { udid: string, model: string }; 
  } catch {
    return res.status(400).json({ success: false, error: "Error decoding token." });
  }

  const hash = await encrypt(decoded.udid, decoded.model);

  let device = await pg("devices").select().where({ hash }).first();

  if (!device) res.status(400).json({ success: false, error: "Invalid Device" });

  try {
    await pg("sessions").where({ device_id: device.device_id }).del();
  } catch {
    return res.status(400).json({ success: false, error: "Internal Server Error" });
  }

  return res.status(200).json({ success: true });
});