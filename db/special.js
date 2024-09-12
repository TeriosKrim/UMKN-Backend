import { DataTypes } from "sequelize";

const Special = (db) => {
    return db.define("special", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        move: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        button: {
            type: DataTypes.STRING,
            allowNull: false,
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
    });
};

export default Special;
