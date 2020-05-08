import express from "express";
import jwt from "jsonwebtoken";
import verify from "../../Helpers/Authentication";
import { encrypt } from "../../Helpers/Pbkdf2";
import pg from "../../db/pg";

export const device = express.Router();

device.post("/verify", verify, async (req, res) => {
  if (!req.body.token) return res.status(400).json({ success: false, error: "Missing fields" });

  let decoded: string | { udid: string, model: string };
  try {
    decoded = jwt.verify(req.body.token, process.env.JWT_SECRET || "") as { udid: string, model: string }; 
  } catch {
    return res.status(400).json({ success: false, error: "Error decoding token." });
  }

  if (!decoded) return res.status(400).json({ success: false, error: "Internal Server Error" });

  const hash = await encrypt(decoded.udid, decoded.model);

  let device = await pg("devices").select().where({ hash }).first();

  return res.status(200).json({ success: true, exists: device != undefined, linked: device.user_id === req.user?.id, device_id: device.device_id });
})

device.post("/link", verify, async (req, res) => {
  if (!req.body.token) return res.status(400).json({ success: false, error: "Missing fields" });
  
  let decoded: string | { udid: string, model: string };
  try {
    decoded = jwt.verify(req.body.token, process.env.JWT_SECRET || "") as { udid: string, model: string }; 
  } catch {
    return res.status(400).json({ success: false, error: "Error decoding token." });
  }

  const hash = await encrypt(decoded.udid, decoded.model);

  let device = await pg("devices").select().where({ hash }).first();

  if (device != undefined && device.user_id != req.user?.id) return res.status(400).json({ success: false, error: "Device is already linked with another account" });

  console.log("nice")

  if (!device) {
    try {
      device = {};
      device.device_id = await pg("devices").insert({
        hash,
        model: decoded.model,
        user_id: req.user?.id
      }).returning("device_id");
    } catch(e) {
      console.log(e)
      return res.status(400).json({ success: false, error: "Internal Server Error" });
    }
  }

  return res.status(200).json({
    device: device.device_id[0] || device.device_id
  });
});