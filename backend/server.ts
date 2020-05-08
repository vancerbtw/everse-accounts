import express from "express";
import next from "next";
import bodyParser from "body-parser";
import cors from "cors";
import accountsApp from "./Accounts/index";

const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();

//route importing
import { localAuth } from "./routes/local_authentication/localAuth";
import { oauth2 } from "./routes/oauth_authentication/authentication";
import { resources } from "./routes/oauth_resources/resources";
import { payments } from "./routes/payments/Payments";
import { device } from "./routes/cydia_authentication/Device";
import { sessions } from "./routes/cydia_authentication/Sessions";
import { stripeRoute } from "./routes/stripe/Stripe";
import { email as emailV1 } from "./routes/email/v1";
import developerInfo from "./routes/developer/Information";

app.use(cors());
app.set('trust proxy', true);

app.use('/stripe', stripeRoute).use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../public'))

//setting up express router routes

nextApp.prepare().then(async () => {
    //use own routes above ^^ next.js route handler
    app.use("/resources", resources);
    app.use("/api/oauth2", oauth2);
    app.use("/auth", localAuth);

    app.get("/payments/purchase/:pkg", (req, res) => {
        nextApp.render(req, res, "/payments/purchase/" + req.params.pkg);
    });
    
    app.get("/portfolio/:developer", (req, res) => {
        nextApp.render(req, res, "/portfolio/" + req.params.developer);
    });

    app.use("/payments", payments);
    app.use("/device", device);
    app.use("/sessions", sessions);
    app.use("/email/v1", emailV1);
    app.use("/developer/info", developerInfo);

    app.get(['/device/auth', '/iPhoneX.png', '/oauth2/authorize', '/homeBanner.png', '/glitch.png', '/everseBanner.png', '/forgotBanner.png', '/authorizeBanner.png', '/forgot-pw', '/', '/_next/*', '/login', "/logout", "/register", "/developer/*"], (req, res) => {
        return handle(req, res);
    });

    app.listen(process.env.PORT || 3004, () => {
        console.log(`Listening on localhost:${process.env.PORT || 3004}`);
    });
});
