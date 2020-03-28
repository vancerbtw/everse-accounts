(async() => {
    const express = require('express');
    const app = express();
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://oauth:oauthPassword!@everse-oauth-ncvla.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        console.log("Connected")
    });

    const port = 3000;
    const fs = require('fs');
    const env = await require('./.env/load')("dev");
    const bodyParser = require('body-parser');
    app.use(bodyParser.json());
    let middleware = fs.readdirSync("./middleware")
    middleware.forEach((x) => {
        if (x.indexOf(".js")) {
            app.JWTKey = env.JWTKey
            let name = x.substr(0, x.indexOf('.'));
            console.log(`Loaded ${name}!`)
            require("./middleware/" + name)(app)
        }
    })
    app.listen(port, () => console.log(`Example app listening on port http://localhost:${port} !`));
})()