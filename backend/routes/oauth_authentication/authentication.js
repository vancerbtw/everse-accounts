import express from 'express';

const router = express.Router();

router.post('/authorization_url', (req, res) => {
    res.send("nice");
});