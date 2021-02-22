const express = require("express");
const Auth = require("discord-oauth2");
const jwt = require('express-jwt');
const token = require('jsonwebtoken');
const { join } = require("path");
const { Client } = require("eris")
const { secret, clientId, clientSecret, discordToken } = require("./config.json");

const oauth = new Auth({ clientId, clientSecret });
const client = new Client(discordToken, {
    disableEvents: {
        CHANNEL_CREATE: true,
        CHANNEL_DELETE: true,
        CHANNEL_UPDATE: true,
        GUILD_BAN_ADD: true,
        GUILD_BAN_REMOVE: true,
        GUILD_DELETE: true,
        GUILD_MEMBER_ADD: true,
        GUILD_MEMBER_REMOVE: true,
        GUILD_MEMBER_UPDATE: true,
        GUILD_ROLE_CREATE: true,
        GUILD_ROLE_DELETE: true,
        GUILD_ROLE_UPDATE: true,
        GUILD_UPDATE: true,
        MESSAGE_CREATE: true,
        MESSAGE_DELETE: true,
        MESSAGE_DELETE_BULK: true,
        MESSAGE_UPDATE: true,
        TYPING_START: true,
        VOICE_STATE_UPDATE: true
    }, restMode: true
});
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(jwt({
    secret: secret,
    credentialsRequired: false,
    algorithms: ["HS256"],
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}));

app.post("/api/auth/code", async (req, res) => {
    const access_token = req.query.access_token;
    const refresh_token = req.query.refresh_token;
    const redirectUri = req.query.redirectUri;

    try {
        const user = await oauth.getUser(access_token);

        const auth_token = token.sign({ id: user.id, email: user.email, refreshToken: refresh_token }, secret);

        return res.json({ "code": auth_token });
    } catch (error) {
        console.log(error);
        res.status(401);
        res.json({ "message": "unauthorized" });
    }
});


app.get("/api/users/@me", async (req, res) => {
    if (req.user) {
        try {
            const { id, username, discriminator, avatar } = await client.getRESTUser(req.user.id);

            return res.json({ id, username, discriminator, avatar: !!avatar ? `https://cdn.discordapp.com/${avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png" });
        } catch (error) {
            console.log(error);
            res.status(404).send("User not found");
            return
        }
    } else {
        res.status(401).send("unauthorized");
        return
    }
});

// static stuff
app.get("/assets/login", async (req, res) => {
    return res.sendFile(join(__dirname ,"assets", "logo.png"))
});

client.connect();
app.listen(2217, () => console.log("Started"));