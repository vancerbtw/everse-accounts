import express, { response } from 'express';
import pg from '../../db/pg';
import jwt from 'jsonwebtoken';

export const resources = express.Router();

interface OAuthUser {
  email: string;
}

interface OAuthPurchase {
  itemID: string;
}

interface OAuthLinkedService {
  picture?: string;
}

interface OAuthResponse {
  user?: OAuthUser;
  purchases?: OAuthPurchase[];
  services?: OAuthLinkedService[];
}

resources.post("/user", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

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

  const token = req.headers.authorization.split(" ")[1];

  const code = req.body.code
  if (!code) {
    return res.status(400).json({
      "success": false,
      "error": "Missing access code on request body"
    });
  }

  const client_id = req.body.client_id;
  if (!client_id) {
    return res.status(400).json({
      "success": false,
      "error": "Missing client_id on request body"
    });
  }
  
  try {
    const applications = await pg("oauth_applications").where({ id: client_id });
    if (applications.length <= 0) {
      return res.status(400).json({
        "success": false,
        "error": "Invalid client_id"
      });
    }
    console.log(applications[0])
    if (applications[0].disabled) {
      return res.status(400).json({
        "success": false,
        "error": "OAuth Application is disabled"
      });
    }
  } catch {
    return res.status(400).json({
      "success": false,
      "error": "Internal server error"
    });
  }

  let data: { approve_id: number } | null = null;
  let approval = null;
  try {
    //getting data from the code provided
    data = jwt.verify(code, process.env.JWT_SECRET || "") as { approve_id: number } | null; 
    //checking if user has still allowed this service to access their account information.
    const approvals = await pg("applications_users").where({ 'applications_users.id': data?.approve_id }).select().innerJoin("oauth_applications", "applications_users.oauth_id", "oauth_applications.id").innerJoin("accounts", "applications_users.user_id", "accounts.id");
    if (approvals.length <= 0) {
      return res.status(400).json({
        "success": false,
        "error": "User has revoked permissions to access account data or this application was removed."
      });
    }
    approval = approvals[0]
  } catch(e) {
    //token could not be successfully decoded
    console.log(e);
    return res.status(400).json({
      "success": false,
      "error": "Error decoding client secret"
    });
  }

  if (approval.disabled) { //this will be true if the user's account is set to disabled and we prob dont want someone to be able to access info from it if that is the case.
    return res.status(400).json({
      "success": false,
      "error": "User's account is disabled and their data cannot be accessed."
    });
  } 
  
  let responseObject: { data: OAuthResponse } = { data: {} }

  for (let index = 0; index < approval.scopes.length; index++) {
    const scope = approval.scopes[index];
    switch (scope) {
      case "email":
        if (!responseObject.data.user) {
          responseObject.data.user = {
            email: approval.email || ""
          };
        }
        break;
    
      case "purchases":
        if (!responseObject.data.user) {
          responseObject.data.purchases = approval?.purchases || [];
        }
        break;

      case "linked_services":
        responseObject.data.services = approval?.linked_services || [];
        break;

      default:
        break;
    }
  }

  return res.status(200).json(responseObject);
});