import { DataTypes } from "sequelize";

const Moves = (db) => {
    return db.define("moves", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        input: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fighterID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "fighters",
                key: "id",
            },
        },
        stanceID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // references: {
            //     model: "stance",
            //     key: "id",
            // },
        },
    });
};

export default Moves;
