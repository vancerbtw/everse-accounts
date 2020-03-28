const fs = require('fs')
const path = (__dirname).split("/").splice(0, (__dirname).split("/").length - 1).join("/")

module.exports = function(app) {
    app.get('/', async function(req, res) {
        res.sendFile(path + `/html/index.html`)
    });
}