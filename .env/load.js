const fs = require("fs")
const path = (__dirname).split("/").splice(0, (__dirname).split("/").length - 1).join("/")

module.exports = async function(env) {
    return await JSON.parse(await fs.readFileSync(`${path}/.env/${env}.json`))
}