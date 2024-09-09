import { DataTypes } from "sequelize";

const Fighter = (db) => {
    return db.define("fighter", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        origin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alignment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        costumevariations: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roster: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "base",
        },
        ps2: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        gamecube: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        psp: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        ultimate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });
};

export default Fighter;
