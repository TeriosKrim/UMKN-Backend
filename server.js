import express from "express";
import cors from "cors";
import { db, comment, fighter, moves, misc, stance, special } from "./db/db.js";
import { Sequelize } from "sequelize";
import { createClerkClient } from "@clerk/backend";
// import { Clerk } from "@clerk/backend";
// import clerkAPIKey from "./clerkAPIKey.js";
import fs from "fs";
import jwt from "jsonwebtoken";

const server = express();
server.use(cors());

server.use(express.json());
const clerkClient = createClerkClient({
    // secretKey: process.env.CLERK_SECRET_KEY,
    secretKey: "sk_live_TkngNiIBCWTqKuiKcLedKbRmxp30GEiCdllOVOnfdC",
});
// In your route / etc:
// clerkClient.users
//     .getUser(
//         "user_2lNofb6N7kTQPNf5E4vxYkgvyym" /* user id from the token, see video / slides */
//     )
//     .then((user) => {
//         console.log(user);
//     });

const validateUserTokenMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        res.status(401).send({ error: "Authorization header not specified!" });
        return;
    }

    const headerParts = header.split(" ");
    if (headerParts.length !== 2) {
        res.status(401).send({
            error: `Malformed Authorization header - expected two words, found ${headerParts.length}`,
        });
        return;
    }

    if (headerParts[0] !== "Bearer") {
        res.status(401).send({
            error: `Malformed Authorization header - expected Bearer scheme, found ${headerParts[0]}`,
        });
        return;
    }

    const token = headerParts[1];
    if (token.length === 0) {
        res.status(401).send({
            error: "Malformed Authorization header - missing token!",
        });
        return;
    }

    const publicKey = fs.readFileSync("./clerk-public-key.pem", {
        encoding: "utf-8",
    });
    let decoded;
    try {
        decoded = jwt.verify(token, publicKey);
    } catch (error) {
        console.error("Error validating token:", error.message);
        res.status(401).json({
            error: "Malformed Authorization header - invalid token!",
        });
        return;
    }

    // Extract the clerk user id from the decoded token data
    req.auth = { clerkUserId: decoded.sub };
    next();
};

server.get("/comment/:fighterID", async (req, res) => {
    const comments = await comment.findAll({
        where: { fighterID: req.params.fighterID },
    });

    const userMetaDataPromises = comments.map((comment) => {
        return clerkClient.users.getUser(comment.createdByClerkUserId);
    });
    const userMetaData = await Promise.all(userMetaDataPromises);

    res.send({
        comments: comments.map((comment, index) => {
            return {
                ...comment.dataValues,
                userMetaData: userMetaData[index],
            };
        }),
    });
});

//
server.post("/comment", validateUserTokenMiddleware, async (req, res) => {
    // console.log(req.user);
    await comment.create({
        ...req.body,
        createdByClerkUserId: req.auth.clerkUserId,
    });
    console.log(req.body);

    const comments = await comment.findAll({
        where: { fighterID: req.body.fighterID },
    });

    const userMetaDataPromises = comments.map((comment) => {
        return clerkClient.users.getUser(comment.createdByClerkUserId);
    });
    const userMetaData = await Promise.all(userMetaDataPromises);

    res.send({
        comments: comments.map((comment, index) => {
            return {
                ...comment.dataValues,
                userMetaData: userMetaData[index],
            };
        }),
    });
});

// Example route to create a move
server.post("/moves", async (req, res) => {
    try {
        const newMove = await moves(db).create(req.body);
        res.status(201).json(newMove);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Example route to fetch all moves
// server.get("/moves", async (req, res) => {
//     try {
//         const allMoves = await Moves(db).findAll();
//         res.status(200).json(allMoves);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// POST route to add data to the misc table
server.post("/misc", async (req, res) => {
    try {
        const newMisc = await Misc(db).create(req.body); // Assuming req.body has bio, ending, and fighterID
        res.status(201).send(newMisc);
    } catch (error) {
        console.error("Error creating misc data:", error);
        res.status(500).send({ error: "Error creating misc data" });
    }
});

server.post("/stance", async (req, res) => {
    try {
        const newStance = await Stance(db).create(req.body); // Assuming req.body has fighterID, platformID, and stance
        res.status(201).send(newStance);
    } catch (error) {
        console.error("Error creating stance:", error);
        res.status(500).send({ error: "Error creating stance" });
    }
});

server.post("/special", async (req, res) => {
    try {
        const newSpecial = await Special(db).create(req.body); // Assuming req.body has fighterID, platformID, and special
        res.status(201).send(newSpecial);
    } catch (error) {
        console.error("Error creating special:", error);
        res.status(500).send({ error: "Error creating special" });
    }
});

server.get("/kombatants", async (req, res) => {
    res.send({ kombatants: await fighter.findAll() });
});

server.get("/kombatant/:id", async (req, res) => {
    res.send({
        kombatant: await fighter.findByPk(req.params.id, {
            include: [
                { model: misc },
                {
                    model: stance,
                    include: moves,
                },
                {
                    model: special,
                },
            ],
        }),
    });
});

server.listen(3001, "0.0.0.0", () => console.log("Listening on port 3001"));

// const existingFighter = await fighter.findOne();
// if (!existingFighter) {
//     await fighter.create({
//         name: "Terios",
//         origin: "N/A",
//         alignment: "N/A",
//         costumevariation: "N/A",
//         ps2: false,
//         gamecube: false,
//         psp: false,
//         ultimate: false,
//     });
// }
