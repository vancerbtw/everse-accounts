import express from "express";
import pg from "../../db/pg";

const info = express.Router();

info.post("/profile", async (req, res) => {
  if (!req.body.dev) return res.status(400).json({
    success: false,
    error: "No 'dev' item provided on Request"
  });
  
  const portfolio = await pg("portfolio").select().where({ portfolio_endpoint: req.body.dev }).first();

  if (!portfolio) return res.status(400).json({
    success: false,
    error: "Invalid portfolio"
  });
  
  return res.status(200).json({
    success: true,
    name: portfolio.developer_display,
    icon: portfolio.developer_icon,
    id: portfolio.developer_id,
    email: portfolio.developer_email,
    pageBody: portfolio.pageBody
  });
});

export default info;