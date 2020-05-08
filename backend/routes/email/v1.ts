import express from "express";
import fetch from "node-fetch";
import verify from "../../Helpers/Authentication";
import emailAuth from "../../../backend/Helpers/EmailAuthentication";
import FuzzySearch from 'fuzzy-search';
import pg from "../../db/pg";

export const email = express.Router();

email.post("/get/:type", emailAuth, async (req, res) => {
  let emails: any[] = [];
  switch (req.params.type.toLowerCase() || "") {
    case "inbox":
      emails = await pg("messages").select().where({sent: false, email_id: req.user?.email_id }).orderBy('time', 'desc');
      res.status(200).json({ success: true, emails});
      break;

    case "star":
      emails = await pg("messages").select().where({starred: true, email_id: req.user?.email_id }).orderBy('time', 'desc');
      res.status(200).json({ success: true, emails });
      break;

    case "sent":
      emails = await pg("messages").select().where({sent: true, email_id: req.user?.email_id }).orderBy('time', 'desc');
      res.status(200).json({ success: true, emails });
      break;

    case "all":
      emails = await pg("messages").select().where({ email_id: req.user?.email_id }).orderBy('time', 'desc');
      res.status(200).json({ success: true, emails });
      break;
    
    default:
      return res.status(400).json({ success: false, error: "Invalid Email Filter Type" })
      break;
  }
});

email.post("/read/:id", emailAuth, async (req, res) => {
  await pg("messages").where({ email_id: req.user?.email_id, message_id: req.params.id }).update({ read: true });

  return res.status(200).json({ success: true });
});

email.post("/star/:id", emailAuth, async (req, res) => {
  await pg("messages").where({ email_id: req.user?.email_id, message_id: parseInt(req.params.id) }).update({ starred: true });

  return res.status(200).json({ success: true });
});

email.post("/unstar/:id", emailAuth, async (req, res) => {
  await pg("messages").where({ email_id: req.user?.email_id, message_id: parseInt(req.params.id) }).update({ starred: false });

  return res.status(200).json({ success: true });
});

email.post("/del/:id", emailAuth, async (req, res) => {
  await pg("messages").where({ email_id: req.user?.email_id, message_id: req.params.id }).del();

  return res.status(200).json({ success: true });
});

email.post("/get/:type/search/:search", emailAuth, async (req, res) => {
  switch (req.params.type.toLowerCase() || "") {
    case "inbox":
      const emails = await pg("messages").select().where({sent: false, email_id: req.user?.email_id}).orderBy('time', 'desc');
      
      const searcher = new FuzzySearch(emails, ['body', 'subject', 'external_display'], {
        caseSensitive: false,
      });
      
      res.status(200).json({ success: true, emails: searcher.search(req.params.search || "")});
      break;

    case "star":
      res.status(200).json({ success: true, emails: []});
      break;

    case "sent":
      res.status(200).json({ success: true, emails: []});
      break;

    case "all":
      res.status(200).json({ success: true, emails: []});
      break;
    
    default:
      return res.status(400).json({ success: false, error: "Invalid Email Filter Type" })
      break;
  }
});

email.post("/send", verify, async (req, res) => {
  if (!req.body.to) return  res.status(400).json({ success: false, error: "No email destination was defined" });
  if (!req.body.subject) return  res.status(400).json({ success: false, error: "No email subject was defined" });
  if (!req.body.text) return  res.status(400).json({ success: false, error: "No email body was defined" });

  if (!req.user?.developer) return res.status(400).json({ success: false, error: "User is not a developer" });

  let email = await pg("emails").select().where({ user_id: req.user?.id }).first();
  if (!email) return res.status(400).json({ success: false, error: "Email not found" });

  let emailRes = await (await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    body: JSON.stringify({
      api_key: process.env.EMAIL_KEY || "",
      to: [req.body.to],
      sender: `<${email.display}@everse.dev>`,
      subject: req.body.subject,
      text_body: req.body.text
    }),
    headers: {
      'Content-Type': "application/json"
    }
  })).json();

  console.log(emailRes);

  return res.status(200).json({ success: true });
});