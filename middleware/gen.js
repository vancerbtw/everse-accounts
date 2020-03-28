const fs = require('fs')
const path = (__dirname).split("/").splice(0, (__dirname).split("/").length - 1).join("/")
const CryptoJS = require("crypto-js");
const base64url = require('base64url');

module.exports = function(app) {
    app.get('/oauth/v1/gen/:obj', async function(req, res) {
        let header = {
            "alg": "HS256",
            "typ": "JWT"
        };
        let stringifiedHeader = JSON.stringify(header)
        let encodedHeader = base64url(stringifiedHeader);
        let data = JSON.parse(base64url.decode(req.params.obj));
        let stringifiedData = JSON.stringify(data);
        let encodedData = base64url(stringifiedData);
        let token = encodedHeader + "." + encodedData;
        let signature = CryptoJS.HmacSHA256(token, app.JWTKey);
        let base64 = CryptoJS.enc.Base64.stringify(signature)
        signature = base64url.fromBase64(base64);
        let signedToken = token + "." + signature;
        res.send(signedToken)
    });
}