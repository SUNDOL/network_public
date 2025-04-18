const userService = require("../service/UserService");

async function userController(fastify, opts) {

    fastify.post("/", async (req, res) => {
        req.logType = "controller";
        const { email, password, callsign } = req.body;
        if (!email || !password || !callsign) {
            return res.status(400).send({ msg: "blank not allowed" });
        };
        try {
            const payload = await userService.createUser(email, password, callsign);
            return res.status(201).send({ payload: payload });
        } catch (e) {
            return res.status(e.code || 500).send({ msg: e.message });
        };
    });

};

module.exports = userController;