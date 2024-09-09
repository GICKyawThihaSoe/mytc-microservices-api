module.exports = app => {
    const withdraws = require("../controllers/withdraw.controller");
    const router = require("express").Router();

    // Create a new Transition
    router.post("/create", withdraws.create);

    // Retrieve all Courses
    router.get("/", withdraws.findAll);

    // Retrieve a single transitions with id
    router.get("/:teacherId", withdraws.findOne);

    router.put("/:id", withdraws.update);

    app.use("/", router);
};
