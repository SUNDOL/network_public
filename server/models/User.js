const bcrypt = require("bcrypt");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define('User', {
    uId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    uEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    uPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uCallsign: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    uRefreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "sundol_users",
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            user.uPassword = await bcrypt.hash(user.uPassword, 10);
        },
        beforeUpdate: async (user) => {
            if (user.changed("uPassword")) {
                if (!user.uPassword || user.uPassword.trim() === "") {
                    throw new Error("Password cannot be empty");
                };
                if (user.uPassword !== user._previousDataValues.uPassword) {
                    const salt = await bcrypt.genSalt(10);
                    user.uPassword = await bcrypt.hash(user.uPassword, salt);
                };
            };
        }
    }
});

module.exports = User;