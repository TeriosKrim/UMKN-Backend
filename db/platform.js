import { DataTypes } from "sequelize";

const Platform = (db) => {
    return db.define("platform", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};

export default Platform;
