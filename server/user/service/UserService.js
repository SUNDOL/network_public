const User = require("../../models/User");

async function createUser(email, password, callsign) {
    try {
        const eCheck = await User.findOne({ where: { uEmail: email } });
        if (eCheck) {
            throw { code: 400, message: "email not allowed" };
        };
        const cCheck = await User.findOne({ where: { uCallsign: callsign } });
        if (cCheck) {
            throw { code: 409, message: "callsign not allowed" };
        };
        const data = await User.create({
            uEmail: email,
            uPassword: password,
            uCallsign: callsign
        });
        const { uPassword, ...newData } = data.dataValues;
        return {
            id: newData.uId,
            email: newData.uEmail,
            nickname: newData.uCallsign
        };
    } catch (e) {
        throw { code: e.code, message: e.message };
    };
};

module.exports = { createUser };