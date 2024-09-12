import { DataTypes } from "sequelize";

const Moves = (db) => {
    return db.define("moves", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        move: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        button: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fighterID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "fighters",
                key: "id",
            },
        },
        // stanceID: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "stance",
        //         key: "id",
        //     },
        // },
    });
};

export default Moves;
