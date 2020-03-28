const fs = require('fs')
const path = (__dirname).split("/").splice(0, (__dirname).split("/").length - 1).join("/")

module.exports = function(app) {
    app.get('/button', async function(req, res) {
        console.log(req.header('Referer'))
        res.sendFile(path + '/html/button.html')
    });
    app.get('/login', async function(req, res) {
        console.log(req.header('Referer'))
        res.sendFile(path + '/html/login.html')
    });
    app.post('/oauth/v1/login/:addID', async function(req, res) {
        console.log(req.body);
        res.send("LOGIN")
    });
}