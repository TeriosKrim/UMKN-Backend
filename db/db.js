import { Sequelize } from "sequelize";
import commentModel from "./comment.js";
import fighterModel from "./fighter.js";
import movesModel from "./moves.js";
import miscModel from "./misc.js";
import stanceModel from "./stance.js";
import SpecialModel from "./special.js";
import kombatants from "./kombatants.json" with {type: "json"};
import combos from "./combo.json" with {type:"json"};
import style from "./style.json" with {type:"json"};
import specials from "./specials.json" with {type:"json"};
import extra from "./extra.json" with {type:"json"};


const db = new Sequelize(process.env.DATABASE_URL || "postgres://localhost:5432/umkd", { logging: false });

// Initialize models
const comment = commentModel(db);
const fighter = fighterModel(db);



const misc = miscModel(db);
const stance = stanceModel(db);
const moves = movesModel(db);
const special = SpecialModel(db);

// Establish relationships (associations)
stance.hasMany(moves, {foreignKey: "stanceID"})
fighter.hasMany(stance, {foreignKey: "fighterID"})
fighter.hasOne(misc, {foreignKey: "fighterID"})
fighter.hasMany(special,{foreignKey: "fighterID"})

const connectToDB = async () => {
    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");


        // Ensure models and associations are reflected in the database
        await db.sync({force: true}); // Use alter or force options carefully

        const existingFighters = await fighter.findAll();

        // Check if there are existing fighters
        const existingMoves = await moves.findAll();
        const existingStance = await stance.findAll();
        const existingSpecial = await special.findAll();
        const existingMisc = await misc.findAll();
     
        if(existingFighters.length  < 5) {
            for(const kombatant of kombatants) {
                
                await fighter.create(kombatant);
            }
        }
        console.log("Fighter Database synchronized.");

        if (existingStance.length < 5) {
            for (const stances of style) {
                await stance.create(stances);
            }
        }
        console.log("Stance Database synchronized.");

        if (existingSpecial.length < 5) {
            for (const sM of specials) {
                await special.create(sM);
            }
        }console.log("Special Database synchronized.");

        if(existingMoves.length < 5){
            for (const move of combos) {
                await moves.create(move);
            }
        } 
        console.log("Move Database synchronized.");

        if(existingMisc.length < 5){
            for (const m of extra) {
                await misc.create(m);
            }
        } 
        console.log("Misc Database synchronized.");
        



    //   if (existingMoves.length < 5){
    //     for (const move of combos) {
    //         await moves.create(move);
    //     }
    //   }
    //   console.log("Move Database synchronized.");

      
        // } console.log("Database synchronized.");
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
    misc,
    special,
    stance,
};
