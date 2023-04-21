const express = require("express")
const seedrandom = require("seedrandom")
const cors = require("cors")
const axios = require('axios')
const { default: DeviantArt } = require("deviantart.ts")
const PixivApi = require('pixiv-api-client');
const pixivImg = require('pixiv-img');
const https = require('https')
const fs = require('fs')

let date = new Date()
let year = date.getUTCFullYear()
let month = date.getUTCMonth() + 1
let day = date.getUTCDate()
let dateString = year + " " + month + " " + day
let pixivIcon

const app = express()
const PasteClient = require("pastebin-api").default;
const client = new PasteClient("HeNM5_fdogmTaVeWrpF7Cl7KOy8SQcbq");
const pixiv = new PixivApi();

let seed = seedrandom(dateString)
let seedNumber = seed()
let token

app.use(cors({
    origin: '*'
}))

let options = {
    key: fs.readFileSync('/etc/letsencrypt/live/n00bultimaback.de/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/n00bultimaback.de/fullchain.pem'),
  };

function checkNewDate() {
    year = date.getFullYear()
    month = date.getMonth() + 1
    day = date.getDate()
    dateString = year + " " + month + " " + day
    seed = seedrandom(dateString)
}

async function login() {
    if (token === undefined) {
        token = await client.login({ name: "n00bUltima", password: "Skolan213141" });
    }
}

app.get("/girl", async (req, res) => {
    await login().then(async function() {
        const girlList = await client.getRawPasteByKey({
            pasteKey: "4AhEMN7p",
            userKey: token,
          });
        const json = JSON.parse(girlList)
        checkNewDate()
        if (seedNumber !== seed()) {
            seedNumber = seed()
        }
        let girlIndex = Math.floor(seedNumber * json.girls.length)
        const girl = json.girls[girlIndex]
            res.status(200).send(girl)
        })
})

app.get("/picon", async (req, res) => { res.sendFile("./" + pixivIcon, { root: '.' })})

app.get("/socials", async (req, res) => {
    let socials = []
    await pixiv.refreshAccessToken("D7J5c1jYk8sD8dA2zivTlpdHHJ5jAbxEgFXnBBmNXf0").catch(function (a) {
        console.log(a)
    });

    let steamR = await axios.get('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=607C45AC6570988FDC932D87E6341A6B&steamids=76561198263186798"')
    socials.push(steamR.data.response)

    const devLogin = await DeviantArt.login("21374", "6a744a9fde1701e3c9f90d0be0a4168a")
    const token = devLogin.data.accessToken

    await pixiv.userDetail("21611220").then((u) => {
        pixivImg(u.user.profile_image_urls.medium).then(output => {
            pixivIcon = output
        });
        socials.push(u.user)
    }).catch(function (a) {
        console.log(a)
    });



    let deviantR = await axios.get("https://www.deviantart.com/api/v1/oauth2/user/profile/n00bUltima", {
        headers: {
            "Authorization": `Bearer ${token}`,
            "client_id": "21374",
            "client_secret": "6a744a9fde1701e3c9f90d0be0a4168a",
        }
    })
    socials.push(deviantR.data.user)

    let itchR = await axios.get("https://itch.io/api/1/VQOvaGFmFDnTOAqgNVY05FjWEDZTXKt0aoogrqKj/me")
    let itchRG = await axios.get("https://itch.io/api/1/VQOvaGFmFDnTOAqgNVY05FjWEDZTXKt0aoogrqKj/my-games")

    socials.push(itchR.data)
    socials.push(itchRG.data)
    
    res.status(200).send(socials)
})

https.createServer(options, app).listen(443)

