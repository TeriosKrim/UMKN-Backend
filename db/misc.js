import { DataTypes } from "sequelize";

const Misc = (db) => {
    return db.define("misc", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ending: {
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

export default Misc;
