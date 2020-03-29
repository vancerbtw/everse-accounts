import express from 'express';
import pg from '../../db/pg';
import jwt from 'jsonwebtoken';

export const oauth2 = express.Router();

// https://accounts.everse.dev/api/oauth2/authorize?client_id=157730590492196864&scope=linked_services%20email&redirect_uri=https%3A%2F%2Fblazerepo.com%2Fauth%2Feverse%2Fcallback

oauth2.post('/authorize', async (req, res) => {
  if (!req.headers.authorization) {
    //Missing Authorization Header so let's return an error 
    return res.status(400).json({
      "success": false,
       "error": "Missing Header: Authorization"
    });
  }
  
  const auth_token = req.headers.authorization.split(' ')[0] !== 'Bearer';
  if (!auth_token) { // Authorization: 'Bearer *token*' 
    //Here we have return a 400 error because the Authorization header contains a misformatted token
    return res.status(400).json({
      "success": false,
      "error": "Invalid format"
    });
  }
  
  const client_id = req.query.client_id;
  if (!client_id) {
    //Missing client_id
    return res.status(400).json({
      "success": false,
      "error": "Missing URL query missing: 'client_id'"
    });
  }

  const redirect_uri = req.query.redirect_uri;
  if (!redirect_uri) {
    //Missing redirect_uri
    return res.status(400).json({
      "success": false,
      "error": "Missing URL query missing: 'redirect_uri'"
    });
  }
  
  if (!req.query.scopes) {
    //Missing scopes
    return res.status(400).json({
      "success": false,
      "error": "Missing URL query missing: 'scopes'"
    });
  }
  
  //splitting scopes up and placing them into an array to make it easier to manage and validate
  const scopes = req.query.scopes.split(' ');
  
  if (scopes.length <= 0) {
    return res.status(400).json({
      "success": false,
      "error": "0 Scopes provided in request"
    });
  }

  //lets decode and verify that authentication header of ours
  try {
    console.log(auth_token)
    const token_payload = jwt.verify(auth_token, process.env.JWT_SECRET);
  } catch(e) {
    //error occured when decoding token
    console.log(e)
    return res.status(400).json({
      "success": false,
      "error": "Invalid Authentication Header"
    });
  }

  if (token_payload.client_id !== client_id) {
    return res.status(400).json({
      "success": false,
      "error": "Authentication Header & Client_id mismatch"
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

  if (!application.redirect_uris.includes(req.query.redirect_uri)) {
    //redirect_uri does not match any redirect uris for application
    return res.status(400).json({
      "success": false,
      "error": "Invalid redirect_uri"
    });
  }
  
  try {
    return res.status(200).json({
      "success": true,
      "token": jwt.sign({ 
        scopes,
        redirect_uri,
        client_id
      }, process.env.JWT_SECRET)
    });
  } catch {
    return res.status(400).json({
      "success": false,
      "error": "Internal Server Error"
    });
  }
});

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
})