import { DataTypes, Model } from "sequelize";

const Comment = (db) => {
    return db.define("comment", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // loginID: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        createdByClerkUserId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // },
        userComment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        commentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
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

export default Comment;
