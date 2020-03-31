import express from "express";
import next from "next";
import bodyParser from "body-parser";
import { localAuth } from "./routes/local_authentication/localAuth";
import { oauth2 } from "./routes/oauth_authentication/authentication";
const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setting up express router routes

nextApp.prepare().then(async () => {
    //use own routes above ^^ next.js route handler
    app.use("/api/oauth2", oauth2);
    app.use("/auth", localAuth);

    app.get(['/oauth2/authorize', '/homeBanner.png', '/glitch.png', '/everseBanner.png', '/forgotBanner.png', '/authorizeBanner.png', '/forgot-pw', '/', '/_next/*', '/login', "/logout", "/register"], (req, res) => {
        return handle(req, res);
    });

    app.listen(process.env.PORT || 3001, () => {
        console.log(`Listening on localhost:${process.env.PORT || 3001}`);
    });
});
