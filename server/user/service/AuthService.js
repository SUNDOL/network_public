require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../../models/User");

async function login(email, password) {
    try {
        const emailCheck = await User.findOne({ where: { uEmail: email }});
        if (!emailCheck) {
            throw { code: 400, message: "not found"};
        };
        const passwordCheck = await bcrypt.compare(password, loginUser.uPassword);
        if (!passwordCheck) {
            throw { code: 400, message: "not found"};
        };
    } catch (e) {

    };
};

async function logout(rtk) {
    try {
        
    } catch (e) {
        
    };
};

module.export = { login, logout };