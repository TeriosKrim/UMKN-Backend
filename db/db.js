import { Sequelize } from "sequelize";
import commentModel from "./comment.js";
import fighterModel from "./fighter.js";
import movesModel from "./moves.js";
import loginModel from "./login.js";
import tierModel from "./tier.js";
import platformModel from "./platform.js";
import miscModel from "./misc.js";
import stanceModel from "./stance.js";
import SpecialModel from "./special.js";
import kombatants from "./kombatants.json" with {type: "json"};

const db = new Sequelize("postgres://localhost:5432/umkd", { logging: false });

// Initialize models
const comment = commentModel(db);
const fighter = fighterModel(db);
const login = loginModel(db);
const tier = tierModel(db);
const platform = platformModel(db);
const misc = miscModel(db);
const stance = stanceModel(db);
const moves = movesModel(db);
const special = SpecialModel(db);

// Establish relationships (associations)

const connectToDB = async () => {
    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");

        // Ensure models and associations are reflected in the database
        await db.sync({alter: true}); // Use alter or force options carefully

        const existingFighters = await fighter.findAll();
     
        if(existingFighters.length  < 5) {
            for(const kombatant of kombatants) {
                
                await fighter.create(kombatant);
            }
        }
        console.log("Database synchronized.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

// Connect to the database
connectToDB();

export {
    db,
    comment,
    fighter,
    moves,
    login,
    platform,
    tier,
    misc,
    special,
    stance,
};
