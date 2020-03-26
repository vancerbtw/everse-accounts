import express from "express";
import next from "next";
import bodyParser from "body-parser";
import accountsApp from "./Accounts/index";

const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

nextApp.prepare().then(async () => {
    app.get('*', (req, res) => {
        return handle(req, res);
    });

    accountsApp.listen(3002);

    app.listen(process.env.PORT || 3001, () => {
        console.log(`Listening on localhost:${process.env.PORT || 3001}`)
    });
});
