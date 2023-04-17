const express = require("express")
const seedrandom = require("seedrandom")

let date = new Date()
let year = date.getUTCFullYear()
let month = date.getUTCMonth() + 1
let day = date.getUTCDate()
let dateString = year + " " + month + " " + day

const app = express()
const PasteClient = require("pastebin-api").default;
const client = new PasteClient("HeNM5_fdogmTaVeWrpF7Cl7KOy8SQcbq");
let seed = seedrandom(dateString)
let seedNumber = seed()




function checkNewDate() {
    year = date.getUTCFullYear()
    month = date.getUTCMonth() + 1
    day = date.getUTCDate()
    dateString = year + " " + month + " " + day
    seed = seedrandom(dateString)
}

app.get('/girl', async (req, res) => {
    const token = await client.login({ name: "n00bUltima", password: "Skolan213141" });
    const girlList = await client.getRawPasteByKey({
        pasteKey: "4AhEMN7p",
        userKey: token,
      });
    const json = JSON.parse(girlList)
    checkNewDate()
    console.log(dateString)
    if (seedNumber !== seed()) {
        seedNumber = seed()
    }
    let girlIndex = Math.floor(seedNumber * json.girls.length)
    const girl = json.girls[girlIndex]
    res.status(200).send(girl)
})

app.listen(8008)


