const authService = require("../service/AuthService");

async function authController(fastify, opts) {

    fastify.post("/login", async (req, res) => {
        req.logType = "controller";
        const { email, password } = req.body;
        try {
            const { atk, rtk } = await authService.login(email, password);
            res.setCookie("sundol_rtk", rtk, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.setHandler("Authorization", `Bearer ${atk}`);
            return res.status(200).send({ payload: atk });
        } catch (e) {
            return res.status(e.code).send({ msg: e.message });
        };
    });

    fastify.post("/logout", async (req, res) => {
        req.logType = "controller";
        const { rtk } = req.cookies;
        try {
            if (!rtk) {
                return res.status(401);
            } else {
                await authService.logout(rtk);
                res.clearCookie("sundol_rtk");
                return res.status(200);
            };
        } catch (e) {
            return res.status(e.code).send({ msg: e.message });
        };
    });

};

module.exports = authController;