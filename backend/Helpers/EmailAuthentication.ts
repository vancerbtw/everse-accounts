import pg from "../db/pg";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction} from "express";

export default async function emailAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(400).json({
      success: false,
      error: "Missing Authorization Header"
    });
  }
  
  if (req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ").length !== 2) {
    return res.status(400).json({
      success: false,
      error: "Invalid Authorization Header Format, Please use 'Bearer {token}' format."
    });
  }

  const token = req.headers.authorization.split(" ")[1]

  try {
    const decoded: { user_id?: string } = jwt.verify(token, process.env.JWT_SECRET || "") as {  user_id?: string  }; 
    const user = await pg("accounts").where({id: decoded.user_id || "" }).first();
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid Token"
      });
    }

    if (user.disabled) {
      return res.status(400).json({
        success: false,
        error: "User is disabled"
      });
    }

    if (!user.developer) {
      return res.status(400).json({
        success: false,
        error: "User is not a developer"
      });
    }

    let everseEmail = await pg("emails").select().where({ user_id: user.id }).first();

    if (!everseEmail) {
      return res.status(400).json({
        success: false,
        error: "User does not have an everse email setup"
      });
    }
    
    req.user = {
      name: user.name,
      email: user.email,
      developer: user.developer,
      verified: user.verified,
      disabled: user.disabled,
      id: user.id,
      email_id: everseEmail.email_id,
      icon: user.icon
    };

    next();
  } catch(e) {
    return res.status(400).json({
      success: false,
      error: "Error decoding token"
    });
  }
}