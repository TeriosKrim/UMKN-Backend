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
        stanceID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "stances",
                key: "id",
            },
        },
    });
};

export default Moves;
