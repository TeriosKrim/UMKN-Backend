import express from "express"; // Import Express to create the server
import cors from "cors"; // Import CORS to allow cross-origin requests
import { db, comment, fighter, moves, misc, stance, special } from "./db/db.js"; // Import models and database instance
import { Sequelize } from "sequelize"; // Sequelize ORM for database interaction
import { createClerkClient } from "@clerk/backend"; // Clerk client for authentication
// import { Clerk } from "@clerk/backend"; // Alternative Clerk import (commented out)
// import clerkAPIKey from "./clerkAPIKey.js"; // Clerk API key import (commented out)
import fs from "fs"; // File system module to read files
import jwt from "jsonwebtoken"; // JWT library for token validation

const server = express(); // Create an Express server instance
server.use(cors()); // Enable CORS for cross-origin requests

server.use(express.json()); // Middleware to parse JSON request bodies

// Initialize Clerk client for user authentication with a secret key
const clerkClient = createClerkClient({
    // secretKey: process.env.CLERK_SECRET_KEY, // Option to use environment variable for the key
    secretKey: "sk_live_TkngNiIBCWTqKuiKcLedKbRmxp30GEiCdllOVOnfdC", // Clerk secret key for authentication
});

// Middleware function to validate user token for protected routes
const validateUserTokenMiddleware = (req, res, next) => {
    const header = req.headers.authorization; // Get the authorization header
    if (!header) {
        res.status(401).send({ error: "Authorization header not specified!" });
        return;
    }

    const headerParts = header.split(" "); // Split the header into parts
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

    const token = headerParts[1]; // Extract the token from the header
    if (token.length === 0) {
        res.status(401).send({
            error: "Malformed Authorization header - missing token!",
        });
        return;
    }

    // Read the public key for token verification
    const publicKey = fs.readFileSync("./clerk-public-key.pem", {
        encoding: "utf-8",
    });
    let decoded;
    try {
        // Verify the token using the public key
        decoded = jwt.verify(token, publicKey);
    } catch (error) {
        console.error("Error validating token:", error.message);
        res.status(401).json({
            error: "Malformed Authorization header - invalid token!",
        });
        return;
    }

    // Attach the Clerk user ID to the request object for future use
    req.auth = { clerkUserId: decoded.sub };
    next(); // Move to the next middleware or route handler
};

// Route to fetch comments for a specific fighter based on their ID
server.get("/comment/:fighterID", async (req, res) => {
    const comments = await comment.findAll({
        where: { fighterID: req.params.fighterID },
    });

    // Fetch user metadata for each comment's creator using Clerk
    const userMetaDataPromises = comments.map((comment) => {
        return clerkClient.users.getUser(comment.createdByClerkUserId);
    });
    const userMetaData = await Promise.all(userMetaDataPromises);

    // Send comments along with the associated user metadata
    res.send({
        comments: comments.map((comment, index) => {
            return {
                ...comment.dataValues,
                userMetaData: userMetaData[index],
            };
        }),
    });
});

// Route to post a new comment (requires valid user token)
server.post("/comment", validateUserTokenMiddleware, async (req, res) => {
    // Create a new comment with data from the request body and the authenticated user ID
    await comment.create({
        ...req.body,
        createdByClerkUserId: req.auth.clerkUserId,
    });
    console.log(req.body);

    // Fetch updated list of comments for the specific fighter
    const comments = await comment.findAll({
        where: { fighterID: req.body.fighterID },
    });

    // Fetch user metadata for each comment
    const userMetaDataPromises = comments.map((comment) => {
        return clerkClient.users.getUser(comment.createdByClerkUserId);
    });
    const userMetaData = await Promise.all(userMetaDataPromises);

    // Return the comments along with user metadata
    res.send({
        comments: comments.map((comment, index) => {
            return {
                ...comment.dataValues,
                userMetaData: userMetaData[index],
            };
        }),
    });
});

// Route to create a new move
server.post("/moves", async (req, res) => {
    try {
        const newMove = await moves(db).create(req.body); // Create a new move from the request body
        res.status(201).json(newMove); // Send a response with the created move
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle any errors that occur
    }
});

// POST route to add data to the misc table
server.post("/misc", async (req, res) => {
    try {
        const newMisc = await Misc(db).create(req.body); // Create a new misc data entry
        res.status(201).send(newMisc); // Send a response with the new misc data
    } catch (error) {
        console.error("Error creating misc data:", error);
        res.status(500).send({ error: "Error creating misc data" }); // Handle any errors
    }
});

// POST route to add a new stance for a fighter
server.post("/stance", async (req, res) => {
    try {
        const newStance = await Stance(db).create(req.body); // Create a new stance entry
        res.status(201).send(newStance); // Respond with the new stance data
    } catch (error) {
        console.error("Error creating stance:", error);
        res.status(500).send({ error: "Error creating stance" }); // Handle any errors
    }
});

// POST route to add a new special move for a fighter
server.post("/special", async (req, res) => {
    try {
        const newSpecial = await Special(db).create(req.body); // Create a new special move entry
        res.status(201).send(newSpecial); // Respond with the created special move data
    } catch (error) {
        console.error("Error creating special:", error);
        res.status(500).send({ error: "Error creating special" }); // Handle any errors
    }
});

// Route to get all kombatants (fighters)
server.get("/kombatants", async (req, res) => {
    res.send({ kombatants: await fighter.findAll() }); // Respond with all fighters from the database
});

// Route to get details of a specific kombatant by their ID
server.get("/kombatant/:id", async (req, res) => {
    res.send({
        kombatant: await fighter.findByPk(req.params.id, {
            include: [
                { model: misc }, // Include misc data
                {
                    model: stance, // Include stances and related moves
                    include: moves,
                },
                {
                    model: special, // Include special moves
                },
            ],
        }),
    });
});

// Start the server and listen on port 3001
server.listen(3001, "0.0.0.0", () => console.log("Listening on port 3001"));
