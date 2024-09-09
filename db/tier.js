import { platform } from "os";
import { DataTypes } from "sequelize";

const Tier = (db) => {
    return db.define("tier", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fighterID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "fighters",
                key: "id",
            },
        },
        platformID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tierLetter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};

export default Tier;
