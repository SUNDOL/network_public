const { User } = require("../model/User");
require("dotenv").config();

const refreshAccessToken = async (req, res) => {
    try {
        const { rtk } = req.cookies;
        if (!rtk) {
            return res.response(401);
        };
        const dec = await res.jwt.verify(rtk);
        const user = await User.findByPk(dec.id);
        if (!user) {
            return res.response(404);
        };
        const newAToken = res.jwt.sign(
            { id: user.uId, email: user.uEmail },
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        );
        res.setCookie("rtk", rtk, { httpOnly: true, path: "/" });
        res.setHeader("Authorization", `Bearer ${newAToken}`);
        req.user = { id: user.uId, email: user.uEmail };
        return res.send({});
    } catch (e) {
        return res.response(401);
    };
};

const authMiddleware = async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Bearer ")) {
        return res.response(401);
    };
    const aToken = authorization.split(" ")[1];
    try {
        const dec = await res.jwt.verify(aToken);
        req.user = { id: dec.id, email: dec.email };
        return;
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            return refreshAccessToken(req, res);
        };
        return res.response(401);
    };
};

const optionalAuthMiddleware = async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith("Bearer ")) {
        req.user = null;
        return;
    };
    const aToken = authorization.split(" ")[1];
    try {
        const dec = await res.jwt.verify(aToken);
        req.user = { id: dec.id, email: dec.email };
        return;
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            return refreshAccessToken(req, res);
        };
        req.user = null;
        return;
    };
};

module.exports = { authMiddleware, refreshAccessToken, optionalAuthMiddleware };