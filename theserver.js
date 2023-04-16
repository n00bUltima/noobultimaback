const express = require("express")
const seedrandom = require("seedrandom")

let date = new Date()
let year = date.getUTCFullYear()
let month = date.getUTCMonth() + 1
let day = date.getUTCDate()
let dateString = year + " " + month + " " + day

const app = express()
let seed = seedrandom(dateString)
let seedNumber = seed()
const girlList = require("./girls.json")

function checkNewDate() {
    year = date.getUTCFullYear()
    month = date.getUTCMonth() + 1
    day = date.getUTCDate() + 40
    dateString = year + " " + month + " " + day
    seed = seedrandom(dateString)
}

app.get('/girl', (req, res) => {
    checkNewDate()
    console.log(dateString)
    if (seedNumber !== seed()) {
        seedNumber = seed()
    }
    let girlIndex = Math.floor(seedNumber * girlList.girls.length)
    const girl = girlList.girls[girlIndex]
    res.status(200).send(girl)
})

app.listen(8008)


