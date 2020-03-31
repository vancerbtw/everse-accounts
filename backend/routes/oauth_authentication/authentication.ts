import express from 'express';
import pg from '../../db/pg';
import jwt from 'jsonwebtoken';

export const oauth2 = express.Router();

// https://accounts.everse.dev/api/oauth2/authorize?client_id=157730590492196864&scope=linked_services%20email&redirect_uri=https%3A%2F%2Fblazerepo.com%2Fauth%2Feverse%2Fcallback

oauth2.post('/authorize/verify', async (req, res) => {  
  const client_id = req.body.client_id;
  if (!client_id) {
    //Missing client_id
    return res.status(400).json({
      "success": false,
      "error": "Missing: 'client_id'"
    });
  }

  const redirect_uri = req.body.redirect_uri;
  if (!redirect_uri) {
    //Missing redirect_uri
    return res.status(400).json({
      "success": false,
      "error": "Missing: 'redirect_uri'"
    });
  }
  
  const scopes = req.body.scopes;
  if (!scopes) {
    //Missing scopes
    return res.status(400).json({
      "success": false,
      "error": "Missing: 'scopes'"
    });
  }
  
  if (scopes.length <= 0) {
    return res.status(400).json({
      "success": false,
      "error": "0 Scopes provided in request"
    });
  }

  //querying for application where the id column matches the client_id provided
  const applications = await pg("oauth_applications").where({id: client_id });

  if (applications.length <= 0) {
    //no valid application was found with client id so an error will be returned
    return res.status(400).json({
      "success": false,
      "error": "Invalid 'client_id'"
    });
  }

  const application = applications[0];

  //looping through scopes to check for invalid/ non selected scopes for selected application
  for (let index = 0; index < scopes.length; index++) {
    const scope = scopes[index].toString();
    if (!application.scopes.includes(scope)) {
      //an invalid scope was found so we will return an error
      return res.status(400).json({
        "success": false,
        "error": "Scope is allowed for application. Define in application panel to use scope."
      });
    }
  }

  if (!application.redirect_uris.includes(redirect_uri)) {
    //redirect_uri does not match any redirect uris for application
    return res.status(400).json({
      "success": false,
      "error": "Invalid redirect_uri"
    });
  }
  
  return res.status(200).json({
    success: true,
    application: {
      name: application.name,
      redirect_uris: application.redirect_uris,
      scopes: application.scopes,
      disabled: application.disabled
    } 
  });
});

oauth2.post("/authorize", async (req, res) => {
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
  let data: { user_id: any; } | null = null;

  //here we are going to decode the user's token and validate the user before authenticating service to access user's data.
  
  try {
    data = jwt.verify(token, process.env.JWT_SECRET); 
    const users = await pg("accounts").where({id: data.user_id });
    if (!users[0]) {
      return res.status(400).json({
        "success": false,
        "invalidate": true,
        "error": "Invalid Token Body"
      });
    }
  } catch(e) {
    //token could not be successfully decoded
    console.log(e);
    return res.status(400).json({
      "success": false,
      "invalidate": true,
      "error": "Error decoding token"
    });
  }

  const client_id = req.body.client_id;
  if (!client_id) {
    //Missing client_id
    return res.status(400).json({
      "success": false,
      "error": "Missing: 'client_id'"
    });
  }

  const redirect_uri = req.body.redirect_uri;
  if (!redirect_uri) {
    //Missing redirect_uri
    return res.status(400).json({
      "success": false,
      "error": "Missing: 'redirect_uri'"
    });
  }
  
  const scopes = req.body.scopes;
  if (!scopes) {
    //Missing scopes
    return res.status(400).json({
      "success": false,
      "error": "Missing: 'scopes'"
    });
  }
  
  if (scopes.length <= 0) {
    return res.status(400).json({
      "success": false,
      "error": "0 Scopes provided in request"
    });
  }

  //querying for application where the id column matches the client_id provided
  const applications = await pg("oauth_applications").where({id: client_id });

  if (applications.length <= 0) {
    //no valid application was found with client id so an error will be returned
    return res.status(400).json({
      "success": false,
      "error": "Invalid 'client_id'"
    });
  }

  const application = applications[0];

  //looping through scopes to check for invalid/ non selected scopes for selected application
  for (let index = 0; index < scopes.length; index++) {
    const scope = scopes[index].toString();
    if (!application.scopes.includes(scope)) {
      //an invalid scope was found so we will return an error
      return res.status(400).json({
        "success": false,
        "error": "Scope is allowed for application. Define in application panel to use scope."
      });
    }
  }

  if (!application.redirect_uris.includes(redirect_uri)) {
    //redirect_uri does not match any redirect uris for application
    return res.status(400).json({
      "success": false,
      "error": "Invalid redirect_uri"
    });
  }

  try {
    pg('applications_users').del().where({
      oauth_id: application.id,
      user_id: data?.user_id
    }).then( async () => {
      return await pg('applications_users').insert({
        oauth_id: application.id,
        user_id: data?.user_id,
        scopes: scopes
      }).returning('id');
    }).then((id) => {
      return res.status(200).json({
        success: true,
        token: jwt.sign({ 
          approve_id: id
        }, process.env.JWT_SECRET)
      });
    });
  } catch(e) {
    return res.status(400).json({
      "success": false,
      "error": "Internal Server Error"
    });
  }
});

//this is a temporary route until developer portal is in place
oauth2.get("/get/token/:client_id", async (req, res) => {
  const applications = await pg("oauth_applications").where({id: req.params.client_id });

  if (applications.length <= 0) {
    //no valid application was found with client id so an error will be returned
    return res.status(400).json({
      "success": false,
      "error": "Invalid 'client_id'"
    });
  }

  const application = applications[0];
  return res.status(200).json({
    "success": true,
    "error": jwt.sign({ 
      client_id: application.id
    }, process.env.JWT_SECRET)
  });
});