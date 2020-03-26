import express from "express";
import next from "next";
import bodyParser from "body-parser";
import vhost from 'vhost'
import accounts from './Accounts/index'

const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(vhost('accounts.localhost', accounts))

nextApp.prepare().then(async () => {
    app.get('*', (req, res) => {
        return handle(req, res);
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Listening on localhost:${process.env.PORT || 3001}`)
    });
});
